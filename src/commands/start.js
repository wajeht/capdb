import { logger } from '../utils/logger.js';
import { shell } from '../utils/shell.js';
import { Database as db } from '../utils/database.js';

import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

function ensureDirectoryExists(directory) {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
}

async function backupDatabase(container) {
	let fileName;
	const backupDirectory = path.join(process.env.HOME, '.config', 'capdb', 'backups');

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
			break;
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
			break;
		default:
			console.log(`Unsupported database type: ${container.database_type}`);
			break;
	}
}

(async function start() {
	const containers = db.getAll();
	for (const container of containers) {
		const task = cron.schedule(
			`*/${container.back_up_frequency} * * * *`,
			async () => {
				logger(`backup started for ${container.container_name}`);
				try {
					await backupDatabase(container);
				} catch (error) {
					logger(error?.message);
				}
				db.update(container.id, {
					...container,
					last_backed_up_at: new Date(),
				});
				logger(`done backup for ${container.container_name}`);
			},
			{
				scheduled: false,
			},
		);
		task.start();
		logger(`backup scheduled for ${container.container_name}`);
	}
})();
