import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from './logger';

export interface Container {
	id: string;
	container_name: string;
	database_name: string;
	database_username: string;
	last_backed_up_at: Date | null;
}

export default class Database {
	private static data: Container[] = [];

	private static initJson() {
		const configFolder = path.join(os.homedir(), '.config', 'capdb');
		const jsonFile = path.join(configFolder, 'database.json');

		if (!fs.existsSync(configFolder)) {
			fs.mkdirSync(configFolder, { recursive: true });
		}

		if (!fs.existsSync(jsonFile)) {
			fs.writeFileSync(jsonFile, JSON.stringify([]));
		} else {
			const jsonData = fs.readFileSync(jsonFile, 'utf-8');
			this.data = JSON.parse(jsonData);
		}
	}

	private static saveJson() {
		const configFolder = path.join(os.homedir(), '.config', 'capdb');
		const jsonFile = path.join(configFolder, 'database.json');

		fs.writeFileSync(jsonFile, JSON.stringify(this.data, null, 2));
	}

	public static getAll(): Container[] {
		if (!this.data.length) {
			this.initJson();
		}

		return this.data;
	}

	public static add(container: Omit<Container, 'id' | 'last_backed_up_at'>): void {
		if (!this.data.length) {
			this.initJson();
		}

		const id = crypto.randomUUID();

		const newContainer: Container = {
			id,
			...container,
			last_backed_up_at: null,
		};

		this.data!.push(newContainer);

		this.saveJson();
	}

	public static async remove(id: string): Promise<void | Error> {
		if (!this.data.length) {
			this.initJson();
		}

		const foundIndex = this.data.findIndex((container) => container.id === id);

		if (foundIndex === -1) {
			return console.log('Not found');
		}

		this.data.splice(foundIndex, 1);

		this.saveJson();

		logger(`${id} has been removed`);
	}

	public static removeAll(): void {
		if (!this.data.length) {
			this.initJson();
		}

		this.data = [];

		this.saveJson();

		logger('All data has been removed');
	}
}
