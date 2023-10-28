import { input } from '@inquirer/prompts';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import db from '../database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function backup(cmd) {
	let { id } = cmd;

	const config = await db.select('*').from('configurations');
	if (config.length === 0) {
		console.log();
		console.log('No configurations detected. Please run `capdb config` first!');
		console.log();
		process.exit(1);
	}

	const containers = await db.select('*').from('containers');
	if (containers.length === 0) {
		console.log();
		console.log('No containers found in the database.');
		console.log();
		process.exit(1);
	}

	console.log();
	console.table(containers);
	console.log();

	if (!id) {
		id = await input({
			message: 'Enter the ID of the container to backup',
			validate: (value) => value.length !== 0,
		});
	}

	const container = await db.select('*').from('containers').where('id', id).first();

	if (!container) {
		console.log();
		console.log('No credentials found with that ID');
		console.log();
		process.exit(1);
	}

	const backupWorker = fork(path.resolve(__dirname, '../utils/backup-worker.js'));
	backupWorker.send(container.id);
	console.log();

	// this causes infinite loop on prod
	// backupWorker.on('message', (message) => {
	// 	if (message === 'done') {
	// 		backupWorker.kill();
	// 		process.exit(0);
	// 	}
	// });
}
