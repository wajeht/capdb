import Docker from 'dockerode';
import { logger } from '../utils/logger.js';
import { minutesToCron } from '../utils/cron.js';
import { shell } from '../utils/shell.js';
import db from '../database/db.js';
import { ensureDirectoryExists } from '../utils/utils.js';
import cron from 'node-cron';
import path from 'path';
import fastq from 'fastq';

const config = await db.select('*').from('configurations').first();

if (!config) {
	logger('No configurations found in database. Please run `capdb config` first.');
	process.exit(1);
}

const backupDirectory = path.join(config.capdb_config_folder_path, 'backups');

ensureDirectoryExists(backupDirectory);

const docker = new Docker();

const queue = fastq(async (containerId, cb) => {
	ensureDirectoryExists(backupDirectory);
	try {
		logger(`Starting backup job for container ID: ${containerId}`);
		const currentDate = new Date().toLocaleString();
		const filePath = await backupDatabase(containerId);

		if (filePath) {
			const absoluteBackupFilePath = path.join(backupDirectory, filePath);
			await updateContainerStatus(containerId, true, currentDate, absoluteBackupFilePath);
			logger(`Successfully backed up container ID: ${containerId}`);
		} else {
			await updateContainerStatus(containerId, false, currentDate, null);
			logger(`Backup failed for container ID: ${containerId}`);
		}
		cb();
	} catch (error) {
		logger(`Error in backup job for container ID: ${containerId}, ${error.message}`);
		cb(error);
	}
}, 1);

async function handleBackup(containerId) {
	try {
		const container = await db.select('*').from('containers').where({ id: containerId }).first();
		if (container) {
			queue.push(container.id, (err) => {
				if (err) {
					logger(`Error while processing backup for ${container.container_name}: ${err.message}`);
				} else {
					logger(`Backup job completed for ${container.container_name}`);
				}
			});
		} else {
			logger(`Container with ID ${containerId} not found`);
		}
	} catch (err) {
		logger(`Error fetching container from database: ${err.message}`);
	}
}

async function backupDatabase(containerId) {
	ensureDirectoryExists(backupDirectory);

	let fileName = '';
	const currentDateISOString = new Date().toISOString().replace(/:/g, '-');

	try {
		logger(`Fetching container info from database`);
		const container = await db.select('*').from('containers').where({ id: containerId }).first();
		const dockerContainers = await docker.listContainers({ all: true });

		const containerExists = dockerContainers.some((c) =>
			c.Names.includes(`/${container.container_name}`),
		);

		if (!containerExists) {
			logger(`Container ${container.container_name} does not exist.`);
			return null;
		}

		logger(`Starting database backup for ${container.container_name}`);
		switch (container.database_type) {
			case 'postgres':
				process.env.PGPASSWORD = container.database_password;
				fileName = `dump-${container.container_name}-${container.database_name}-${currentDateISOString}.sql`;
				await shell(
					`docker exec -i ${container.container_name} pg_dump -U ${
						container.database_username
					} -d ${container.database_name} > ${path.join(backupDirectory, fileName)}`,
				);
				delete process.env.PGPASSWORD;
				break;

			case 'mongodb':
				fileName = `dump-${container.container_name}-${container.database_name}-${currentDateISOString}`;
				await shell(
					`docker exec -i ${container.container_name} mongodump --username ${
						container.database_username
					} --password ${container.database_password} --db ${
						container.database_name
					} --out ${path.join(backupDirectory, fileName)}`,
				);
				break;

			default:
				logger(`Unsupported database type: ${container.database_type}`);
				return null;
		}

		return fileName;
	} catch (error) {
		logger(`Error during backup: ${error?.message}`);
		return null;
	}
}

async function updateContainerStatus(containerId, status, lastBackedUpAt, lastBackedUpFile) {
	ensureDirectoryExists(backupDirectory);
	try {
		logger(`Updating container status in database`);
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
	ensureDirectoryExists(backupDirectory);
	logger(`Fetching list of containers from database`);
	const containers = await db.select('*').from('containers');

	if (!containers.length) {
		logger(`No containers to back up.`);
		process.exit(0);
	}

	containers.forEach((container) => {
		const cronSchedule = minutesToCron(container.back_up_frequency);

		const task = cron.schedule(
			cronSchedule,
			() => {
				handleBackup(container.id);
			},
			{ scheduled: false },
		);

		task.start();
		logger(`Backup scheduled for ${container.container_name}`);
	});
}

start();
