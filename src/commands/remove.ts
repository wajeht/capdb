import { input } from '@inquirer/prompts';
import { Database as db } from '../utils';

export async function remove(cmd: any) {
	let { id, all } = cmd;

	if (all) {
		return db.removeAll();
	}

	if (!id) {
		id = await input({
			message: 'Enter id',
			validate: (value) => value.length !== 0,
		});
	}

	db.remove(id);
}
