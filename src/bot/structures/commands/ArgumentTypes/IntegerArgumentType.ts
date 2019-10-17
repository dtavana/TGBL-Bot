import { Message } from 'eris';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class IntegerArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'float');
    }

    public async validate(val, msg: Message, arg: ICommandArgument) {
        const int = Number.parseInt(val, 10);
        if (Number.isNaN(int)) {
            return false;
        }
        if (arg.min !== null && typeof arg.min !== 'undefined' && int < arg.min) {
            return `Please enter a number above or exactly ${arg.min}.`;
        }
        if (arg.max !== null && typeof arg.max !== 'undefined' && int > arg.max) {
            return `Please enter a number below or exactly ${arg.max}.`;
        }
        return true;
    }

    public async parse(val) {
        return Number.parseFloat(val);
    }
}

export { IntegerArgumentType };
