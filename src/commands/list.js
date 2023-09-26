import { Database as db } from '../utils/database.js';

export async function list() {
	const list = db.getAll();

	console.log();

	if (list.length === 0) {
		return console.error('There is nothing in the list!');
	}

	console.table(list);
}
