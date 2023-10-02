import { shell } from '../utils/shell.js';
import db from '../database/db.js';

export async function config() {
	const config = await db.from('configurations').returning('*');

	console.log();

	if (config.length === 0) {
		console.error('No items found in the list. The backup scheduler is not active.');
		console.log();
		process.exit(0);
		return;
	}

	await shell('pm2 delete capdb && pm2 save --force');
	console.log();
}
