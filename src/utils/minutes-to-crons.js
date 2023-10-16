export function minutesToCron(minutes) {
	if (minutes <= 0 || minutes >= 9999999999) {
		return 'Invalid input. Please provide a positive integer less than 9999999999.';
	}

	if (minutes < 60) {
		// For less than 1 hour (e.g., 30 minutes)
		const minuteValue = minutes % 60;
		return `${minuteValue} * * * *`;
	} else if (minutes < 1440) {
		// For less than 24 hours (e.g., 90 minutes)
		const minuteValue = minutes % 60;
		const hourValue = Math.floor(minutes / 60);
		return `${minuteValue} ${hourValue} * * *`;
	} else if (minutes < 10080) {
		// For less than 7 days (e.g., 4320 minutes)
		const minuteValue = minutes % 60;
		const hourValue = Math.floor(minutes / 60) % 24;
		const dayValue = Math.floor(minutes / 60 / 24);
		return `${minuteValue} ${hourValue} * * ${dayValue}`;
	} else {
		// For weeks and months (e.g., 10080+ minutes)
		const minuteValue = minutes % 60;
		const hourValue = Math.floor(minutes / 60) % 24;
		const dayValue = Math.floor(minutes / 60 / 24) % 7;
		const weekValue = Math.floor(minutes / 60 / 24 / 7);
		return `${minuteValue} ${hourValue} * * ${dayValue} ${weekValue}`;
	}
}
