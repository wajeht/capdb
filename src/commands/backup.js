import { input } from '@inquirer/prompts';
import db from '../database/db.js';
import { handleBackup } from '../utils/backup-worker.js';

export async function backup(cmd) {
	let { id } = cmd;

	const config = await db.select('*').from('configurations');

	if (config.length === 0) {
		console.log('No configurations detected. Please run `capdb config` first!');
		process.exit(0);
	}

	const containers = await db.select('*').from('containers');
	console.log();

	if (containers.length === 0) {
		console.log('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	console.table(containers);
	console.log();

	let sure = false;

	while (!sure) {
		if (!id) {
			id = await input({
				message: 'Enter the ID of the contianer to backup',
				validate: (value) => value.length !== 0,
			});
			console.log();
		}

		const container = await db.select('*').from('containers').where('id', id).first();

		if (!container) {
			console.log('No credentials found with that ID');
			console.log();
			process.exit(1);
		}


		if (container.database_type === 'postgres') {
			await handleBackup(container.id);
			process.exit(0);
		}

		if (container.database_type === 'mongodb') {
			await handleBackup(container.id);
			process.exit(0);
		}

		console.log('Invalid database type. Please try again.');
		process.exit(1);
	}
}
