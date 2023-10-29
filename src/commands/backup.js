import path from 'path';
import db from '../database/db.js';
import { fileURLToPath } from 'url';
import { fork } from 'child_process';
import { input } from '@inquirer/prompts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function backup(cmd) {
	let { id } = cmd;

	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations detected. Please run `capdb config` first!');
		console.log();
		return process.exit(1);
	}

	const containers = await db.select('*').from('containers');

	if (containers.length === 0) {
		console.log();
		console.error('No containers found in the database.');
		console.log();
		return process.exit(1);
	}

	console.log();
	console.table(containers);
	console.log();

	if (!id) {
		// prettier-ignore
		id = await input({ message: 'Enter the ID of the container to backup', validate: (value) => value.length !== 0 });
	}

	const container = await db.select('*').from('containers').where('id', id).first();

	if (!container) {
		console.log();
		console.error('No credentials found with that ID');
		console.log();
		return process.exit(1);
	}

	const backupWorker = fork(path.resolve(__dirname, '../utils/backup-worker.js'));
	backupWorker.send(container.id);
	console.log();

	// todo: find alternative, this is not keeping our main process running
	// backupWorker.on('message', (message) => {
	// 	if (message === 'done') {
	// 		backupWorker.kill();
	// 		return process.exit(0);
	// 	}
	// });
}
