import { describe, it, expect } from 'vitest';
import { validDatabaseTypes } from './constants.js';

describe('validDatabaseTypes', async () => {
	it('should on be postgres or mongodb', async () => {
		expect(validDatabaseTypes).toEqual(['postgres', 'mongodb']);
	});
});
