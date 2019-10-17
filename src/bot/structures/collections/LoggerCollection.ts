import { BaseLogger } from '../../logging';

class LoggerCollection extends Map<string, BaseLogger> {
    constructor() {
        super();
    }

    public sendLog(payload: string, ...args: string[]) {
        for (const logger of args) {
            const registeredLogger = this.get(logger);
            if (registeredLogger) {
                registeredLogger.sendLog(payload);
            }
        }
    }
}

export { LoggerCollection };
