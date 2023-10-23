import db from '../database/db.js';
import os from 'os';
import fs from 'fs';

export async function exportt() {
	const containers = await db.select('*').from('containers');
	const config = await db.select('*').from('configurations');

	console.log();

	if (containers.length === 0) {
		console.error('No containers found in the database.');
		console.log();
		process.exit(1);
	}

	if (config.length === 0) {
		console.error('No configurations found in the database.');
		console.log();
		process.exit(1);
	}

	const data = {
		containers,
		config,
	};

	const desktopPath = os.homedir() + '/desktop';

	fs.writeFileSync(desktopPath + '/capdb.json', JSON.stringify(data, null, 2));

	console.log('capdb.json file created on your desktop');
	console.log();
	process.exit(0);
}
