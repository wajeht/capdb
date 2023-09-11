import { Database as db } from '../utils';

export async function list() {
	const list = db.getAll();

	if (list.length === 0) {
		return console.error('Empty!');
	}

	console.table(list);
}
