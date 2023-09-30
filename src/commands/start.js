import Docker from 'dockerode';
import { logger } from '../utils/logger.js';
import { shell } from '../utils/shell.js';
import { Database as db } from '../utils/database.js';

import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import os from 'os';

const backupDirectory = path.join(os.homedir(), '.config', 'capdb', 'backups');

ensureDirectoryExists(backupDirectory);

const docker = new Docker();

function ensureDirectoryExists(directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
}

async function backupDatabase(container) {
	let fileName = '';

	const currentDateISOString = new Date().toISOString().replace(/:/g, '-');

	const containers = await docker.listContainers({ all: true });

	const containerExists = containers.some((c) => c.Names.includes(`/${container.container_name}`));

	if (!containerExists) {
		logger(`Container ${container.container_name} does not exist.`);
		return null;
	}

	try {
		if (container.database_type === 'postgres') {
			process.env.PGPASSWORD = container.database_password;
			// prettier-ignore
			fileName = path.join(backupDirectory, `dump-${container.container_name}-${container.database_name}-${currentDateISOString}.sql`);
			// prettier-ignore
			await shell(`docker exec -i ${container.container_name} pg_dump -U ${container.database_username} -d ${container.database_name} > ${fileName}`);
			delete process.env.PGPASSWORD;
		} else if (container.database_type === 'mongodb') {
			// prettier-ignore
			fileName = path.join(backupDirectory, `dump-${container.container_name}-${container.database_name}-${currentDateISOString}`);
			// prettier-ignore
			await shell(`docker exec -i ${container.container_name} mongodump --username ${container.database_username} --password ${container.database_password} --db ${container.database_name} --out ${fileName}`);
		} else {
			logger(`Unsupported database type: ${container.database_type}`);
			return null;
		}

		return fileName;
	} catch (error) {
		logger(error?.message);
		return null;
	}
}

async function start() {
	const containers = await db.getAll();

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
					const filePath = await backupDatabase(container);
					if (filePath) {
						await db.update(container.id, {
							...container,
							status: true,
							last_backed_up_at: new Date(),
							last_backed_up_file: filePath,
						});
					} else {
						logger(`Backup failed for ${container.container_name}`);
					}
				} catch (error) {
					logger(error?.message);
					await db.update(container.id, {
						...container,
						status: false,
						last_backed_up_at: new Date(),
						last_backed_up_file: null,
					});
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
