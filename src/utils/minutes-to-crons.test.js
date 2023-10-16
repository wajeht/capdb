import { describe, test, expect } from 'vitest';
import { minutesToCron } from './minutes-to-crons.js';

describe('minutesToCron', () => {
	test('converts less than 1 hour', () => {
		const result = minutesToCron(30);
		expect(result).toBe('30 * * * *');
	});

	test('converts less than 24 hours', () => {
		const result = minutesToCron(90);
		expect(result).toBe('30 1 * * *');
	});

	test('converts less than 7 days', () => {
		const result = minutesToCron(4320);
		expect(result).toBe('0 0 * * 3');
	});

	test('converts 7 days or more (weeks and months)', () => {
		const result = minutesToCron(10080);
		expect(result).toBe('0 0 * * 0 1');
	});

	test('handles invalid input', () => {
		const result = minutesToCron(0);
		expect(result).toBe('Invalid input. Please provide a positive integer less than 9999999999.');
	});
});
