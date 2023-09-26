import { Database as db } from '../utils/database.js';

export async function list() {
	const list = db.getAll();

	if (list.length === 0) {
		return console.error('\nThere is nothing in the list!\n');
	}

	console.table(list);
}
