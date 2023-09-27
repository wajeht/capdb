import { input } from '@inquirer/prompts';
import { Database as db } from '../utils/database.js';

export async function remove(cmd) {
	let { id, all } = cmd;

	let sure = false;

	if (all) {
		const list = await db.getAll();

		if (list.length === 0) {
			console.log();
			console.warn('There is nothing to remove!');
			console.log();
			return;
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
			console.log();
			console.info('Ok, exited remove operation!');
			console.log();
			return;
		}

		await db.removeAll();

		console.log();
		console.info('Everything has been removed!');
		console.log();
		return;
	}

	if (!id) {
		id = await input({
			message: 'Enter id',
			validate: (value) => value.length !== 0,
		});
	}

	await db.remove(id);
}
