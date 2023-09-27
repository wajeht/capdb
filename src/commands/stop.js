import { shell } from '../utils/shell.js';

export async function stop() {
	console.log();
	await shell('pm2 delete capdb && pm2 save --force');
}
