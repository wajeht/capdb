import { fileURLToPath } from 'url';
import path from 'path';
import { shell } from '../utils/shell.js';
import { version } from '../utils/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async function main() {
	await shell(`${path.resolve(__dirname, 'publish.sh')}`);
	await shell('npm run format');
	await shell('git add .');
	await shell(`git commit -am "chore: release v${version()}" --no-verify`);
	await shell(`git push --no-verify`);
})();
