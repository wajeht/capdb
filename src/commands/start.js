import Docker from 'dockerode';
import { logger } from '../utils/logger.js';
import { shell } from '../utils/shell.js';
import db from '../database/db.js';
import { ensureDirectoryExists } from '../utils/utils.js';

import cron from 'node-cron';
import path from 'path';

const config = await db.select('*').from('configurations').first();

const backupDirectory = path.join(config.capdb_config_folder_path, 'backups');

ensureDirectoryExists(backupDirectory);

const docker = new Docker();

async function backupDatabase(containerId) {
	let fileName = '';
	const currentDateISOString = new Date().toISOString().replace(/:/g, '-');

	try {
		const container = await db.select('*').from('containers').where({ id: containerId }).first();
		const dockerContainers = await docker.listContainers({ all: true });

		const containerExists = dockerContainers.some((c) =>
			c.Names.includes(`/${container.container_name}`),
		);

		if (!containerExists) {
			logger(`Container ${container.container_name} does not exist.`);
			return null;
		}

		switch (container.database_type) {
			case 'postgres':
				process.env.PGPASSWORD = container.database_password;
				fileName = `dump-${container.container_name}-${container.database_name}-${currentDateISOString}.sql`;
				// prettier-ignore
				await shell(`docker exec -i ${container.container_name} pg_dump -U ${container.database_username} -d ${ container.database_name } > ${path.join(backupDirectory, fileName)}`);
				delete process.env.PGPASSWORD;
				break;

			case 'mongodb':
				fileName = `dump-${container.container_name}-${container.database_name}-${currentDateISOString}`;
				// prettier-ignore
				await shell(`docker exec -i ${container.container_name} mongodump --username ${ container.database_username } --password ${container.database_password} --db ${ container.database_name } --out ${path.join(backupDirectory, fileName)}`);
				break;

			default:
				logger(`Unsupported database type: ${container.database_type}`);
				return null;
		}

		return fileName;
	} catch (error) {
		logger(error?.message);
		return null;
	}
}

async function updateContainerStatus(containerId, status, lastBackedUpAt, lastBackedUpFile) {
	try {
		const updatedContainer = await db('containers').where('id', containerId).update({
			status: status,
			last_backed_up_at: lastBackedUpAt,
			last_backed_up_file: lastBackedUpFile,
		});

		if (updatedContainer === 1) {
			return true;
		} else {
			logger(`Failed to update container with ID ${containerId}`);
			return false;
		}
	} catch (error) {
		logger(`Error updating container with ID ${containerId}: ${error.message}`);
		return false;
	}
}

async function start() {
	const config = await db.select('*').from('configurations').first();

	if (!config) {
		logger(`No configurations found.`);
		process.exit(0);
	}

	const containers = await db.select('*').from('containers');

	if (!containers.length) {
		logger(`No containers to back up.`);
		process.exit(0);
	}

	const backupPromises = containers.map(async (container) => {
		const task = cron.schedule(
			`*/${container.back_up_frequency} * * * *`,
			async () => {
				logger(`Backup started for ${container.container_name}`);
				try {
					const filePath = await backupDatabase(container.id);
					if (filePath) {
						const absoluteBackupFilePath = path.join(backupDirectory, filePath);
						await updateContainerStatus(container.id, true, new Date(), absoluteBackupFilePath);
					} else {
						logger(`Backup failed for ${container.container_name}`);
						await updateContainerStatus(container.id, false, new Date(), null);
					}
				} catch (error) {
					logger(error?.message);
					await updateContainerStatus(container.id, false, new Date(), null);
				} finally {
					logger(`Backup completed for ${container.container_name}`);
				}
			},
			{ scheduled: false },
		);
		task.start();
		logger(`Backup scheduled for ${container.container_name}`);
	});

	await Promise.all(backupPromises);
}

start();
