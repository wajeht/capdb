import pino from 'pino';
import path from 'path';

const today = new Date().toISOString().split('T')[0];

const fileStream = { stream: pino.destination(path.join(__dirname, '..', 'logs', `${today}.log`)) };
const consoleStream = { stream: process.stdout }; // Stream to log to console

const streams = [fileStream, consoleStream];

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
