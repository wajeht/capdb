import pino from 'pino';
import path from 'path';

const today: string = new Date().toISOString().split('T')[0];

const streams = [{ stream: pino.destination(path.join(__dirname, '..', 'logs', `${today}.log`)) }];

const logger = pino(
	{
		useOnlyCustomProps: true,
		level: 'info',
		formatters: {
			level: (label: string) => {
				return { level: label };
			},
		},
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	pino.multistream(streams),
);

export default logger;
