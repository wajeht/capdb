import db from '../database/db.js';

export async function importt(cmd) {
	console.log(cmd);
	const containers = await db.select('*').from('containers');
	const config = await db.select('*').from('configurations');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(0);
	}

	if (config.length === 0) {
		console.error('No configurations found in the database.');
		console.log();
		process.exit(0);
	}

	console.log('import() has not been implemented yet.');
	console.log();
	process.exit(0);
}
