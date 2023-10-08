import { describe, it, expect, vi } from 'vitest';
import { scan } from './scan.js';

vi.mock('dockerode', async () => {
	return {
		default: class Docker {
			constructor() {
				this.listContainers = function listContainers(callback) {
					callback(null, [
						{ Id: '1', Names: ['/container1'], Created: '2021-01-01' },
						{ Id: '2', Names: ['/container2'], Created: '2021-01-02' },
					]);
				};
			}
		},
		...(await vi.importActual('dockerode')).default,
	};
});

const consoleMock = {
	log: vi.fn(),
	error: vi.fn(),
	table: vi.fn(),
};

globalThis.console = consoleMock;

describe('scan', () => {
	it('should print containers to the console', async () => {
		await scan();

		expect(consoleMock.log).toHaveBeenCalled();
		expect(consoleMock.table).toHaveBeenCalled([
			{
				Id: '1',
				Names: 'container1',
				Created: '2021-01-01',
			},
			{
				Id: '2',
				Names: 'container2',
				Created: '2021-01-02',
			},
		]);
	});

	// it('should print an error message if no containers were found', async () => {
	// 	vi.mock('dockerode', async () => {
	// 		return {
	// 			default: class Docker {
	// 				constructor() {
	// 					this.listContainers = function listContainers(callback) {
	// 						callback(null, []);
	// 					};
	// 				}
	// 			},
	// 			...(await vi.importActual('dockerode')).default,
	// 		};
	// 	});

	// 	await scan();

	// 	expect(consoleMock.error).toHaveBeenCalledWith('No containers were found.');
	// });
});
