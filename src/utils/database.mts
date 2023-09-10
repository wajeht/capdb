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
const filePath = path.resolve(path.join(process.cwd(), 'src', 'utils', jsonFile));

if (!fs.existsSync(filePath)) {
	fs.writeFileSync(filePath, JSON.stringify([]));
}

interface Container {
	id: string;
	container_name: string;
	database_name: string;
	database_username: string;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

class Database {
	private data: Container = [];
}
