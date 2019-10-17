import { Message } from 'eris';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class StringArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'string');
    }

    public async validate(val: string, msg: Message, arg: ICommandArgument) {
        if (arg.min !== null && typeof arg.min !== 'undefined' && val.length < arg.min) {
            return `Please keep the ${arg.key} above or exactly ${arg.min} characters.`;
        }
        if (arg.max !== null && typeof arg.max !== 'undefined' && val.length > arg.max) {
            return `Please keep the ${arg.key} below or exactly ${arg.max} characters.`;
        }
        return true;
    }

    public async parse(val: string) {
        return val;
    }
}

export { StringArgumentType };
