import fs from 'fs';
import path from 'path';
import logger from './logger';

const ENV_JSON = path.resolve(path.join(process.cwd(), 'env.json'));

if (!fs.existsSync(ENV_JSON)) {
	logger.error('env.json does not exist.');
	process.exit(1);
}

let parsedEnvData = null;

try {
	const envData = fs.readFileSync(ENV_JSON, 'utf-8');
	parsedEnvData = JSON.parse(envData);
} catch (error) {
	logger.error('Error reading or parsing env.json:', error);
	process.exit(1);
}

export interface Container {
	name: string;
	username: string;
	database: string;
}

export const containers: Container[] = parsedEnvData.containers;
