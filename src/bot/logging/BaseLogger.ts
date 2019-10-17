import { createLogger, format, Logger } from 'winston';
const { combine, timestamp, label, prettyPrint } = format;

class BaseLogger {
    public loggerName: string;
    private _logger: Logger;
    private readonly _loggerOptions: object;
    private readonly _level: string;
    private readonly _transports: any;
    constructor(loggerName: string, level: string, ...transports: any[]) {
        this.loggerName = loggerName;
        this._level = level;
        this._transports = transports;
        this._loggerOptions = {
            format:
                combine(
                    label({ label: this.loggerName }),
                    timestamp(),
                    prettyPrint({ colorize: true }),
                ),
            level: 'debug',
            transports: this._transports,
        };
        this._logger = createLogger(this._loggerOptions);
    }
    public sendLog(payload: string) {
        this._logger.log(this._level, payload);
    }
}

export { BaseLogger };
