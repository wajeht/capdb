import { fileURLToPath } from 'url';
import path from 'path';
import { shell } from '../utils/shell.js';
import { version } from '../utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function main() {
	await shell('./publish.sh');
	await shell('npm run format');
	console.log(`git commit -am "chore: release v${version()}" --no-verify`);
	console.log(`git push --no-verify`);
})();
