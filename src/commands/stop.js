import { shell } from '../utils/shell.js';
import { Database as db } from '../utils/database.js';

export async function stop() {
	let lists = await db.getAll();

	console.log();

	if (lists.length === 0) {
		console.error('No items found in the list. The backup scheduler is not active.');
		console.log();
		return;
	}

	await shell('pm2 delete capdb && pm2 save --force');
	console.log();
}
