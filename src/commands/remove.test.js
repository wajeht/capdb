import db from '../database/db.js';
import { remove } from './remove.js';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { input } from '@inquirer/prompts';

describe('remove', () => {
	beforeAll(async () => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(process, 'exit').mockImplementation(() => {});
		vi.mock('@inquirer/prompts', () => ({
			input: vi.fn(),
		}));

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

	describe('when providing the --all flag', () => {
		describe('when the user does confirm the information', () => {
			it('should exist with Everything has been removed!', async () => {
				// prettier-ignore
				await db('containers').insert({ container_name: 'container_name', database_type: 'container_path', database_name: 'container_size', database_username: 'container_last_modified', database_password: 'container_last_modified', });
				// prettier-ignore
				await db('configurations').insert({ capdb_config_folder_path: 'path', s3_access_key: 'access_key', s3_secret_key: 'secret_key', s3_bucket_name: 'bucket_name', s3_region: 'region', });
				input.mockImplementationOnce(() => 'y');
				await remove({ all: true });

				expect(input).toHaveBeenCalledWith(
					expect.objectContaining({
						message: 'Are you sure these above the correct information? (y/n)',
					}),
				);
				expect(console.log).toHaveBeenCalledWith('Everything has been removed!');
				expect(console.log).toHaveBeenCalledTimes(12);
				expect(process.exit).toHaveBeenCalledWith(0);
			});
		});
	});

	describe('when providing the --all flag', () => {
		describe('when the user does not confirm the information', () => {
			it('should exit with Everything has been removed!x', async () => {
				// prettier-ignore
				await db('containers').insert({ container_name: 'container_name', database_type: 'container_path', database_name: 'container_size', database_username: 'container_last_modified', database_password: 'container_last_modified', });
				// prettier-ignore
				await db('configurations').insert({ capdb_config_folder_path: 'path', s3_access_key: 'access_key', s3_secret_key: 'secret_key', s3_bucket_name: 'bucket_name', s3_region: 'region', });

				input.mockImplementationOnce(() => 'n');

				await remove({ all: true });

				expect(input).toHaveBeenCalledWith(
					expect.objectContaining({
						message: 'Are you sure these above the correct information? (y/n)',
					}),
				);
				expect(console.log).toHaveBeenCalledWith('Ok, exited remove operation!');
				expect(process.exit).toHaveBeenCalledWith(0);
			});
		});
	});
});
