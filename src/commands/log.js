import { shell } from '../utils/shell.js';
import { Database as db } from '../utils/database.js';

export async function log() {
	let lists = await db.getAll();

	console.log();

	if (lists.length === 0) {
		console.error('There is nothing in the list!');
		console.log();
		return;
	}

	await shell('pm2 log capdb --lines 5');
}
