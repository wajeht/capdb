import { Database as db } from '../utils/database.js';

export async function status() {
	const list = db.getAll();

	console.log();

	if (list.length === 0) {
		console.error('There is nothing in the list!');
		console.log();
		return;
	}

	console.table(list);
	console.log();
}
