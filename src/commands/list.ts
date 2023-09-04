import { shell } from '../utils/shell';

export async function list() {
	await shell('pm2 list');
}
