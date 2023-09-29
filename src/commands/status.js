import { Database as db } from '../utils/database.js';

export async function status() {
	let lists = await db.getAll();

	console.log();

	if (lists.length === 0) {
		console.error('No items found in the list. The backup scheduler is not active.');
		console.log();
		return;
	}

	console.table(lists);
	console.log();
}
