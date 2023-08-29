import fs from 'fs';
import path from 'path';

const ENV_JSON = path.resolve(path.join(process.cwd(), 'env.json'));

if (!fs.existsSync(ENV_JSON)) {
	console.error('env.json does not exist.');
	process.exit(1);
}

let parsedEnvData = null;

try {
	const envData = fs.readFileSync(ENV_JSON, 'utf-8');
	parsedEnvData = JSON.parse(envData);
} catch (error) {
	console.error('Error reading or parsing env.json:', error);
	process.exit(1);
}

export interface Container {
	name: string;
	username: string;
	database: string;
}

export const containers: Container[] = parsedEnvData.containers;
