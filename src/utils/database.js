import os from 'os';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const validDatabaseTypes = ['postgres', 'mysql', 'mongodb', 'redis'];

export class Database {
	static data = [];

	static configFolder = path.join(os.homedir(), '.config', 'capdb');
	static jsonFile = path.join(this.configFolder, 'database.json');

	static initJson() {
		if (!fs.existsSync(this.configFolder)) {
			fs.mkdirSync(this.configFolder, { recursive: true });
		}

		if (!fs.existsSync(this.jsonFile)) {
			fs.writeFileSync(this.jsonFile, '[]');
		}

		const jsonData = fs.readFileSync(this.jsonFile, 'utf-8');
		this.data = JSON.parse(jsonData);
	}

	static saveJson() {
		fs.writeFileSync(this.jsonFile, JSON.stringify(this.data, null, 2));
	}

	static getAll() {
		if (!this.data.length) {
			this.initJson();
		}

		return this.data;
	}

	static add(container) {
		if (!this.data.length) {
			this.initJson();
		}

		const id = crypto.randomUUID();

		const newContainer = {
			id,
			...container,
			last_backed_up_at: null,
			status: null,
			last_backed_up_file: null,
		};

		this.data.push(newContainer);

		this.saveJson();
	}

	static remove(id) {
		if (!this.data.length) {
			this.initJson();
		}

		const foundIndex = this.data.findIndex((container) => container.id === id);

		if (foundIndex === -1) {
			return console.error('\nNot found\n');
		}

		this.data.splice(foundIndex, 1);

		this.saveJson();
	}

	static removeAll() {
		if (!this.data.length) {
			this.initJson();
		}

		this.data = [];

		this.saveJson();
	}

	static update(id, container) {
		if (!this.data.length) {
			this.initJson();
		}

		const foundIndex = this.data.findIndex((c) => c.id === id);

		if (foundIndex === -1) {
			return console.log('Not found');
		}

		const updatedContainer = {
			id,
			...this.data[foundIndex],
			...container,
		};

		this.data[foundIndex] = updatedContainer;

		this.saveJson();
	}
}
