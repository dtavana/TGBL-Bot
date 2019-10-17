import { transports } from 'winston';
import { BaseLogger } from './index';

class ConsoleLogger extends BaseLogger {
    constructor() {
        super('console', 'info', new transports.Console());
    }

}

export { ConsoleLogger };
