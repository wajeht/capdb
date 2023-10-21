export function timeToCron(time) {
	const timeParts = time.toString().split('.');
	const minutes = parseInt(timeParts[0]) || 0;
	const seconds = timeParts[1] ? parseInt(timeParts[1]) * 10 ** (2 - timeParts[1].length) : 0;

	if (minutes < 0 || minutes >= 44640 || seconds < 0 || seconds >= 60) {
		return 'Invalid input';
	}

	if (seconds > 0) {
		return `*/${seconds} * * * * *`;
	} else if (minutes < 60) {
		return `0 */${minutes} * * * *`;
	} else if (minutes < 1440) {
		const hours = Math.floor(minutes / 60);
		return `0 0 */${hours} * * *`;
	} else if (minutes < 10080) {
		const days = Math.floor(minutes / 1440);
		return `0 0 0 */${days} * *`;
	} else {
		const weeks = Math.floor(minutes / 10080);
		return `0 0 0 ? * ${weeks}`;
	}
}
