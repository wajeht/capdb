import { describe, test, expect } from 'vitest';
import { timeToCron } from './time-to-cron.js';

describe('timeToCron', () => {
	test('converts seconds', () => {
		expect(timeToCron(0.1)).toBe('*/10 * * * * *');
		expect(timeToCron(0.03)).toBe('*/3 * * * * *');
		expect(timeToCron(0.3)).toBe('*/30 * * * * *');
	});

	test('converts less than 1 hour', () => {
		expect(timeToCron(30)).toBe('0 */30 * * * *');
	});

	test('converts less than 24 hours', () => {
		expect(timeToCron(90)).toBe('0 0 */1 * * *');
	});

	test('converts less than 7 days', () => {
		expect(timeToCron(4320)).toBe('0 0 0 */3 * *');
	});

	test('converts 7 days or more', () => {
		expect(timeToCron(10080)).toBe('0 0 0 ? * 1');
	});

	test('handles invalid input', () => {
		expect(timeToCron(-1)).toBe('Invalid input');
		expect(timeToCron(44640)).toBe('Invalid input');
	});
});
