import fs from 'fs';
import os from 'os';
import path from 'path';
import { ensureDirectoryExists } from './utils.js';
import { describe, it, expect, afterAll } from 'vitest';

describe('ensureDirectoryExists', async () => {
	const testDirectory = path.join(os.homedir(), 'test');
	it('should create a directory if it does not exist', async () => {
		ensureDirectoryExists(testDirectory);
		expect(fs.existsSync(testDirectory)).toBe(true);
	});

	afterAll(async () => {
		try {
			deleteFolderRecursive(testDirectory);
		} catch (error) {
			console.error('Error deleting test directory:', error);
		}
	});

	function deleteFolderRecursive(directoryPath) {
		if (fs.existsSync(directoryPath)) {
			fs.readdirSync(directoryPath).forEach((file) => {
				const curPath = path.join(directoryPath, file);
				if (fs.lstatSync(curPath).isDirectory()) {
					deleteFolderRecursive(curPath);
				} else {
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(directoryPath);
		}
	}
});
