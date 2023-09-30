import fs from 'fs';
import { exec } from 'child_process';
import { Database as db } from '../utils/database.js';
import { input } from '@inquirer/prompts';

export async function restore(cmd) {
	let lists = await db.getAll();

	console.log();

	if (lists.length === 0) {
		console.error('No items found in the list. The backup scheduler is not active.');
		console.log();
		return;
	}

	let { index } = cmd;

	if (!index) {
		console.table(lists);
		console.log();
	}

	if (!index) {
		index = await input({
			message: 'Specify the index of the container to restore',
			validate: function (value) {
				if (value.length !== 0 && isNaN(value)) return 'Index must be a number';
				if (lists[parseInt(value)] === undefined) return 'No container found with the given index.';
				return true;
			},
		});
	}

	const container = lists[index];

	if (
		container.last_backed_up_at === null ||
		container.status === null ||
		container.status === false ||
		container.last_backed_up_file === null
	) {
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
		exec(command, (stdin, stdout, error) => {
			if (error) {
				console.error(`Something went wrong while restoreing ${container.container_name}`, error);
				console.log();
				return;
			}

			if (stdout) {
				console.log('Staring restore.....');
				console.log();
				console.log(stdout);
				console.log('Restoring done.....!');
				console.log();
				return;
			}
		});
	}
}
