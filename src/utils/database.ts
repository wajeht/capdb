import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// const configFolder = os.homedir() + '/.jaw/capdb';

// if (fs.existsSync(configFolder)) {
// 	console.log('yes');
// } else {
// 	fs.mkdirSync(configFolder, { recursive: true });
// }

// const jsonFile = configFolder + '/database.json';

export interface Container {
	id: string;
	container_name: string;
	database_name: string;
	database_username: string;
	last_backed_up_at: Date | null;
}

export default class Database {
	private data: Container[] = [];

	constructor() {
		this.initJson();
	}

	private initJson() {
		const filePath = path.resolve(path.join(process.cwd(), 'src', 'utils', 'database.json'));

		if (!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, JSON.stringify([]));
		}

		this.data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
	}

	private saveJson() {
		fs.writeFileSync(
			path.resolve(path.join(process.cwd(), 'src', 'utils', 'database.json')),
			JSON.stringify(this.data, null, 2),
		);
	}

	public getAll(): Container[] {
		return this.data;
	}

	public add(container: Omit<Container, 'id' | 'last_backed_up_at'>): void {
		if (!this.data) {
			this.initJson();
		}

		const id = crypto.randomUUID();

		const newContainer: Container = {
			id,
			...container,
			last_backed_up_at: null,
		};

		this.data.push(newContainer);

		this.saveJson();
	}

	public async remove(id: string): Promise<void | Error> {
		const found = this.data.find((container) => container.id === id);

		if (!found) {
			return console.log('Not found');
		}

		this.data = this.data.filter((container) => container.id !== id);

		this.saveJson();

		console.log(`${id} has been removed`);
	}
}
