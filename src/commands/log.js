import db from '../database/db.js';
import { shell } from '../utils/shell.js';

export async function log() {
	const containers = await db.select('*').from('containers');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		return process.exit(0);
	}

	await shell('pm2 log capdb --lines 10');

	console.log();
}
