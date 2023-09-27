import { logger } from '../utils/logger.js';
import { shell } from '../utils/shell.js';
import { Database as db } from '../utils/database.js';

import cron from 'node-cron';
import path from 'path';
import fs from 'fs';
import os from 'os';

function ensureDirectoryExists(directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
}

async function backupDatabase(container) {
	let fileName = '';

	const backupDirectory = path.join(os.homedir(), '.config', 'capdb', 'backups');

	ensureDirectoryExists(backupDirectory);

	switch (container.database_type) {
		case 'postgres':
			process.env.PGPASSWORD = container.database_password;
			fileName = path.join(
				backupDirectory,
				`dump-${container.container_name}-${container.database_name}-${new Date()
					.toISOString()
					.replace(/:/g, '-')}.sql`,
			);
			await shell(
				`docker exec -i ${container.container_name} pg_dump -U ${container.database_username} -d ${container.database_name} > ${fileName}`,
			);
			delete process.env.PGPASSWORD;
			return fileName;
		case 'mongodb':
			fileName = path.join(
				backupDirectory,
				`dump-${container.container_name}-${container.database_name}-${new Date()
					.toISOString()
					.replace(/:/g, '-')}`,
			);
			await shell(
				`docker exec -i ${container.container_name} mongodump --username ${container.database_username} --password ${container.database_password} --db ${container.database_name} --out ${fileName}`,
			);
			return fileName;
		default:
			console.log(`Unsupported database type: ${container.database_type}`);
			break;
	}
}

async function start() {
	const containers = db.getAll();

	if (!containers.length) {
		logger(`Nothing to backup!`);
		process.exit(0);
	}

	const backupPromises = containers.map(async (container) => {
		return new Promise(async (resolve) => {
			const task = cron.schedule(
				`*/${container.back_up_frequency} * * * *`,
				async () => {
					logger(`Backup started for ${container.container_name}`);
					try {
						const filePath = await backupDatabase(container);
						db.update(container.id, {
							...container,
							last_backed_up_at: new Date(),
							status: true,
							last_backed_up_file: filePath,
						});
					} catch (error) {
						logger(error?.message);
						db.update(container.id, {
							...container,
							last_backed_up_at: new Date(),
							status: false,
							last_backed_up_file: null,
						});
					} finally {
						logger(`Backup completed for ${container.container_name}`);
						resolve();
					}
				},
				{ scheduled: false },
			);
			task.start();
			logger(`Backup scheduled for ${container.container_name}`);
		});
	});

	await Promise.all(backupPromises);
}

start();
