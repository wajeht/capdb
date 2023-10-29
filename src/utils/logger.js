import fs from 'fs';
import path from 'path';
import db from '../database/db.js';

function getLogFileName() {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}.log`;
}

export async function logger(...args) {
	const config = await db.select('*').from('configurations').first();

	if (!config) {
		console.log();
		console.error('No configurations found in the database.');
		console.log();
		return process.exit(0);
	}

	const logDir = path.join(config.capdb_config_folder_path, 'logs');

	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true });
	}

	const logFilePath = path.join(logDir, getLogFileName());
	const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
	const logMessage = `[${timestamp}] ${args.join(' ')}\n`;

	console.log(logMessage);
	fs.appendFileSync(logFilePath, logMessage, 'utf8');
}
