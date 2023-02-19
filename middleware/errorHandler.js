import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(dirname, '..', 'logs'))) {
      await fsPromises.mkdir(path.join(dirname, '..', 'logs'));
    }
    await fsPromises.appendFile(path.join(dirname, '..', 'logs', logFileName), logItem);
  } catch (err) {
    console.log(err);
  }
};

export const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log');
  console.log(err.stack);

  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status).json({ error: err.message });
  next();
};
