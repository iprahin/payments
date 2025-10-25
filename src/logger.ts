import pino from "pino";
import path from "path";

const d = new Date();
const _date = `${d.getFullYear()}_${d.getMonth()}_${d.getDay()}`;

const logFilePath = path.join(__dirname, '..', './logs', `app-${_date}.log`);


const pinoLogger = pino({
  level: 'info',
  transport: {
    targets: [
      {
        target: 'pino/file',
        options: { destination: logFilePath },
        level: 'info',
      },
    ],
  },
});

export default pinoLogger;