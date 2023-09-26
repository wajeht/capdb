import { shell } from '../utils/shell.js';

export async function log() {
	console.log();
	await shell('pm2 log backup-script --lines 5');
}
