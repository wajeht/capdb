import { fork } from 'child_process';
import { logger } from '../utils/logger.js';
import { timeToCron } from '../utils/time-to-cron.js';
import db from '../database/db.js';
import { ensureDirectoryExists } from '../utils/utils.js';
import cron from 'node-cron';
import path from 'path';
import fastq from 'fastq';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = await db.select('*').from('configurations').first();

if (!config) {
	logger('No configurations found in database. Please run `capdb config` first.');
	process.exit(1);
}

const backupDirectory = path.join(config.capdb_config_folder_path, 'backups');

ensureDirectoryExists(backupDirectory);

const queue = fastq.promise(handleBackup, 1);

async function handleBackup(containerId) {
	ensureDirectoryExists(backupDirectory);
	const backupWorker = fork(path.resolve(__dirname, '../utils/backup-worker.js'));
	backupWorker.send({ containerId, backupDirectory });
	backupWorker.on('message', (message) => {
		logger(message);
	});
}

async function start() {
	ensureDirectoryExists(backupDirectory);
	const containers = await db.select('*').from('containers');
	if (!containers.length) {
		logger('No containers to back up.');
		process.exit(0);
	}
	containers.forEach((container) => {
		const cronExpression = timeToCron(container.back_up_frequency);
		cron.schedule(cronExpression, () => {
			queue.push(container.id, (err) => {
				if (err) {
					logger(`Error while processing backup for ${container.container_name}: ${err.message}`);
				}
			});
		});
	});
}

start();
