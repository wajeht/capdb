import { shell } from '../utils/shell.js';
import db from '../database/db.js';

export async function stop() {
	const containers = await db.select('*').from('containers');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	await shell('pm2 delete capdb && pm2 save --force');
	console.log();
	process.exit(0);
}
