import db from '../database/db.js';
import cron from 'node-cron';
import path from 'path';
import { fork } from 'child_process';
import { logger } from '../utils/logger.js';
import { timeToCron } from '../utils/time-to-cron.js';
import { ensureDirectoryExists } from '../utils/utils.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function start() {
	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations found. Run `capdb config` first.');
		console.log();
		return process.exit(1);
	}

	const backupDirectory = path.join(config.capdb_config_folder_path, 'backups');

	await ensureDirectoryExists(backupDirectory);

	const containers = await db.select('*').from('containers');

	if (!containers.length) {
		console.log();
		console.error('No containers found in the database.');
		console.log();
		return process.exit(1);
	}

	containers.forEach((container) => {
		const cronExpression = timeToCron(container.back_up_frequency);
		// prettier-ignore
		logger(`Scheduling backup for container ${container.id} with cron expression ${cronExpression}`);
		cron.schedule(cronExpression, () => {
			const backupWorker = fork(path.resolve(__dirname, '../utils/backup-worker.js'));
			logger(`Starting backup worker for container ${container.id}...`);
			backupWorker.send(container.id);
		});
		logger(`Scheduled backup for container ${container.id}`);
	});
}

start();
