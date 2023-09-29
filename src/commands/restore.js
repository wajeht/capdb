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

	console.table(lists);
	console.log();

	let { index } = cmd;

	if (!index) {
		if (!index) {
			index = await input({
				message: 'Specify the index of the container to restore',
				validate: (value) =>
					value.length !== 0 && !isNaN(value) ? true : 'Index must be a number!',
			});
		}
	}
}
