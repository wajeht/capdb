import fs from 'fs';
import { exec } from 'child_process';
import db from '../database/db.js';
import { input } from '@inquirer/prompts';

export async function restore(cmd) {
	const containers = await db.select('*').from('containers');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	let { index } = cmd;

	if (!index) {
		console.table(containers);
		console.log();
	}

	if (!index) {
		index = await input({
			message: 'Specify the index of the container to restore',
			validate: function (value) {
				if (value.length !== 0 && isNaN(value)) return 'Index must be a number';
				if (containers[parseInt(value)] === undefined)
					return 'No container found with the given index.';
				return true;
			},
		});
	}

	const container = containers[index];

	if (!container.last_backed_up_at || !container.status || !container.last_backed_up_file) {
		console.log();
		console.error(
			'The scheduler has not run for backing up this container or it cannot be restored.',
		);
		console.log();
		return;
	}

	if (container.last_backed_up_file && !fs.existsSync(container.last_backed_up_file)) {
		console.log();
		console.log('Backup file does not exist for this container.');
		console.log();
		return;
	}

	if (container.database_type === 'postgres') {
		const command = `docker exec -i ${container.container_name} psql -U ${container.database_username} -d ${container.database_name} < ${container.last_backed_up_file}`;
		exec(command, (error, stdout) => {
			if (error) {
				console.error(`Something went wrong while restoring ${container.container_name}`, error);
				console.log();
				return;
			}

			if (stdout) {
				console.log('Starting restore.....');
				console.log();
				console.log(stdout);
				console.log('Restoring done.....!');
				console.log();
				return;
			}
		});
	}
}
