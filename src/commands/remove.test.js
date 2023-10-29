import { remove } from './remove.js';
import { describe, it, expect, beforeEach, vi, beforeAll, afterAll, afterEach } from 'vitest';
import db from '../database/db.js';

describe('remove', () => {
	beforeAll(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(process, 'exit').mockImplementation(() => {});
	});

	beforeEach(async () => {
		await db.migrate.latest();
	});

	afterEach(async () => {
		vi.resetAllMocks();
		console.log.mockRestore();
		console.error.mockRestore();
		process.exit.mockRestore();

		await db.migrate.rollback();
	});

	afterAll(async () => {
		vi.restoreAllMocks();
		await db.destroy();
	});

	describe('when there is nothing in the configuration table', () => {
		it('should exit with "No configurations detected. Please run `capdb config` first!"', async () => {
			await remove({ id: 1 });
			// prettier-ignore
			expect(console.error).toHaveBeenCalledWith('No configurations detected. Please run `capdb config` first!');
			expect(console.log).toHaveBeenCalledTimes(1);
			expect(process.exit).toHaveBeenCalledWith(1);
		});
	});
});
