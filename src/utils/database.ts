import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Container {
	id: string;
	container_name: string;
	database_name: string;
	database_username: string;
	last_backed_up_at: Date | null;
}

export class Database {
	private static data: Container[] = [];

	private static readonly configFolder: string = path.join(os.homedir(), '.config', 'capdb');
	private static readonly jsonFile: string = path.join(this.configFolder, 'database.json');

	private static initJson(): void {
		if (!fs.existsSync(this.configFolder)) {
			fs.mkdirSync(this.configFolder, { recursive: true });
		}

		if (!fs.existsSync(this.jsonFile)) {
			fs.writeFileSync(this.jsonFile, '[]');
		}

		const jsonData = fs.readFileSync(this.jsonFile, 'utf-8');
		this.data = JSON.parse(jsonData);
	}

	private static saveJson(): void {
		fs.writeFileSync(this.jsonFile, JSON.stringify(this.data, null, 2));
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

		this.data.push(newContainer);

		this.saveJson();
	}

	public static remove(id: string): void | Error {
		if (!this.data.length) {
			this.initJson();
		}

		const foundIndex = this.data.findIndex((container) => container.id === id);

		if (foundIndex === -1) {
			return console.log('Not found');
			return;
		}

		this.data.splice(foundIndex, 1);

		this.saveJson();
	}

	public static removeAll(): void {
		if (!this.data.length) {
			this.initJson();
		}

		this.data = [];

		this.saveJson();
	}

	public static update(id: string, container: Omit<Container, 'id'>): void {
		if (!this.data.length) {
			this.initJson();
		}

		const foundIndex = this.data.findIndex((c) => c.id === id);

		if (foundIndex === -1) {
			return console.log('Not found');
		}

		const updatedContainer: Container = {
			id,
			...this.data[foundIndex],
			...container,
		};

		this.data[foundIndex] = updatedContainer;

		this.saveJson();
	}
}
