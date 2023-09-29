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

	// now we restore ...
}
