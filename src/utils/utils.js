import { existsSync, mkdirSync } from 'fs';
import { promisify } from 'util';

const mkdirAsync = promisify(mkdirSync);

export async function ensureDirectoryExists(directory) {
	if (!existsSync(directory)) {
		await mkdirAsync(directory, { recursive: true });
	}
}
