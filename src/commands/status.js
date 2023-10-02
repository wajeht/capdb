import db from '../database/db.js';

export async function status() {
	const containers = await db.select('*').from('containers');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	console.table(containers);
	console.log();
	process.exit(0);
}
