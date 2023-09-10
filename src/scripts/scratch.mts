import os from 'os';
import fs from 'fs';
import path from 'path';

// const configFolder = os.homedir() + '/.jaw/capdb';

// if (fs.existsSync(configFolder)) {
// 	console.log('yes');
// } else {
// 	fs.mkdirSync(configFolder, { recursive: true });
// }

// const jsonFile = configFolder + '/database.json';

const jsonFile = 'database.json';
const filePath = path.resolve(path.join(process.cwd(), 'src', 'scripts', jsonFile));

if (!fs.existsSync(filePath)) {
	fs.writeFileSync(filePath, JSON.stringify([]));
}
