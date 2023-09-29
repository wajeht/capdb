import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export const validDatabaseTypes = ['postgres', 'mysql', 'mongodb', 'redis'];

export class Database {
	static data = [];
	static configFolder = path.join(os.homedir(), '.config', 'capdb');
	static jsonFile = path.join(this.configFolder, 'database.json');

	static async initJson() {
		try {
			await fs.access(this.configFolder);
		} catch (error) {
			await fs.mkdir(this.configFolder, { recursive: true });
		}

		try {
			await fs.access(this.jsonFile);
		} catch (error) {
			await fs.writeFile(this.jsonFile, '[]');
		}

		const jsonData = await fs.readFile(this.jsonFile, 'utf-8');
		this.data = JSON.parse(jsonData);
	}

	static async saveJson() {
		await fs.writeFile(this.jsonFile, JSON.stringify(this.data, null, 2));
	}

	static async ensureDataInitialized() {
		if (!this.data.length) {
			await this.initJson();
		}
	}

	static async getAll() {
		await this.ensureDataInitialized();
		return this.data;
	}

	static async add(container) {
		await this.ensureDataInitialized();

		const id = crypto.randomUUID();

		const newContainer = {
			id,
			...container,
			last_backed_up_at: null,
			status: null,
			last_backed_up_file: null,
		};

		this.data.push(newContainer);

		await this.saveJson();
	}

	static async remove(id) {
		await this.ensureDataInitialized();

		const foundIndex = this.data.findIndex((container) => container.id === id);

		if (foundIndex === -1) {
			return console.error('\nNo containers matching the specified ID were found.\n');
		}

		this.data.splice(foundIndex, 1);

		await this.saveJson();
	}

	static async removeAll() {
		await this.ensureDataInitialized();
		this.data = [];

		await this.saveJson();
	}

	static async update(id, container) {
		await this.ensureDataInitialized();

		const foundIndex = this.data.findIndex((c) => c.id === id);

		if (foundIndex === -1) {
			return console.error('\nNo containers matching the specified ID were found.\n');
		}

		const updatedContainer = {
			id,
			...this.data[foundIndex],
			...container,
		};

		this.data[foundIndex] = updatedContainer;

		await this.saveJson();
	}
}
