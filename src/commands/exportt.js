import os from 'os';
import fs from 'fs';
import db from '../database/db.js';

export async function exportt() {
	const containers = await db.select('*').from('containers');
	const config = await db.select('*').from('configurations');

	console.log();

	if (config.length === 0) {
		console.warn('No configurations found in the database.');
		console.log();
	}

	if (containers.length === 0) {
		console.warn('No containers found in the database.');
		console.log();
	}

	const data = {
		containers,
		config,
	};

	const desktopPath = os.homedir() + '/desktop';

	fs.writeFileSync(desktopPath + '/capdb.json', JSON.stringify(data, null, 2));

	console.log(`capdb.json file has been created at ${desktopPath}/capdb.json`);
	console.log();
	process.exit(0);
}
