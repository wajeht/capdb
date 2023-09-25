import { input } from '@inquirer/prompts';
import { Database as db } from '../utils';

export async function remove(cmd: any) {
	let { id, all } = cmd;

	let sure = false;

	if (all) {
		const list = db.getAll();

		if (list.length === 0) {
			return console.warn('\nThere is nothing to remove!\n');
		}

		console.table(list);

		sure =
			(await input({
				message: 'Are you sure these above the correct information? (y/n)',
				validate: (value) => value === 'y' || value === 'n',
			})) === 'y'
				? true
				: false;

		if (!sure) {
			console.info('\nOk, exited remove operation!\n');
			return;
		}

		db.removeAll();

		console.info('\nEverything have been remove!\n');
		return;
	}

	if (!id) {
		id = await input({
			message: 'Enter id',
			validate: (value) => value.length !== 0,
		});
	}

	db.remove(id);
}
