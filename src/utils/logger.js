import fs from 'fs';
import path from 'path';
import os from 'os';

let logDate = new Date();
const logDir = path.join(os.homedir(), '.config', 'capdb', 'logs');

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
	const timestamp = new Date().toLocaleString('en-US', {
		timeZoneName: 'short',
	});
	const logMessage = `[${timestamp}] ${args.join(' ')}\n`;

	console.log(logMessage);

	fs.appendFileSync(logFilePath, logMessage, 'utf8');
}
