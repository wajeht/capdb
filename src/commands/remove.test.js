import { remove } from './remove.js';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import db from '../database/db.js';

describe('remove', () => {
	beforeAll(async () => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(process, 'exit').mockImplementation(() => {});
		await db.migrate.latest();
	});

	afterAll(async () => {
		await db.migrate.rollback();
		await db.destroy();
	});

	describe('when there is nothing in the configuration table', () => {
		it('should exit with "No configurations detected. Please run `capdb config` first!"', async () => {
			await remove({ id: 1 });
			// prettier-ignore
			expect(console.error).toHaveBeenCalledWith('No configurations detected. Please run `capdb config` first!');
			expect(process.exit).toHaveBeenCalledWith(1);
			expect(console.log).toHaveBeenCalledTimes(1);
		});
	});

	describe('when there is no containers in the database', () => {
		it('should exit with "No containers found in the database."', async () => {
			// prettier-ignore
			await db('configurations').insert({ capdb_config_folder_path: 'path', s3_access_key: 'access_key', s3_secret_key: 'secret_key', s3_bucket_name: 'bucket_name', s3_region: 'region' });
			await remove({ id: 1 });
			// prettier-ignore
			expect(console.error).toHaveBeenCalledWith('No containers found in the database.');
			expect(process.exit).toHaveBeenCalledWith(1);
			expect(console.log).toHaveBeenCalledTimes(3);
		});
	});
});
