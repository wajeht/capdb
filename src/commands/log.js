import { shell } from '../utils/shell.js';

export async function log() {
	console.log();
	await shell('pm2 log capdb --lines 5');
}
