import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'production';
export const validDatabaseTypes = ['postgres', 'mongodb'];

export const version = () => {
	const currentFilePath = fileURLToPath(import.meta.url);
	const packageJsonPath = path.resolve(path.dirname(currentFilePath), '../../package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	return packageJson.version;
};
