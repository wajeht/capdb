import fs from 'fs';
import path from 'path';
import db from '../database/db.js';

const config = await db.select('*').from('configurations').first();

let logDate = new Date();

const logDir = path.join(config.capdb_config_folder_path, 'logs');

function getLogFileName() {
	const today = new Date();
	if (today.getDate() !== logDate.getDate()) {
		logDate = today;
	}
	const year = today.getFullYear();
	const month = (today.getMonth() + 1).toString().padStart(2, '0');
	const day = today.getDate().toString().padStart(2, '0');
	return `${year}-${month}-${day}.log`;
}

const logFilePath = path.join(logDir, getLogFileName());

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

export function logger(...args) {
	const logFilePath = path.join(logDir, getLogFileName());

	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir, { recursive: true });
	}

	const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
	const logMessage = `[${timestamp}] ${args.join(' ')}\n`;

	console.log(logMessage);

	fs.appendFileSync(logFilePath, logMessage, 'utf8');
}
