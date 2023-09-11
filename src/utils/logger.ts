import pino from 'pino';
import path from 'path';
import os from 'os';
import fs from 'fs';

const today = new Date().toISOString().split('T')[0];

const logDir = path.join(os.homedir(), '.config', 'capdb', 'logs');

if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir, { recursive: true });
}

const logFilePath = path.join(logDir, `${today}.log`);

const fileStream = { stream: pino.destination(logFilePath) };

const consoleStream = { stream: process.stdout };

const streams = [fileStream, consoleStream];

export const logger = pino(
	{
		useOnlyCustomProps: true,
		level: 'info',
		formatters: {
			level: (label: string) => {
				return { level: label };
			},
		},
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	pino.multistream(streams),
);
