import {Message} from 'eris';
import {TGBLClient} from '../client';
import {Command, CommandArgumentType, Context, ICommandArgument} from '../commands';
import {BaseHandler} from './BaseHandler';

class CommandHandler extends BaseHandler {
    constructor(client: TGBLClient) {
        super(client, 'handle-command');
    }

    public async run(message: Message): Promise<void> {
        if (message.author.bot) { return; }
        const command: any[] | false = await this.parseCommand(message);
        if (command === false) {
            return; // Message was not detected as a command
        }
        const foundCommand = command[0];
        const argsToLookAt = command[1];
        const args: any[] | string | null = await this.parseArgs(message, foundCommand, argsToLookAt);
        if (typeof args === 'string') {
            const ctx = new Context(this.client, message, null);
            return await this.client.sendMessage('error', this.client, ctx, args);
             // parseArgs returned as error message here
        }
        const context = new Context(this.client, message, args);
        if (args === null) {
            await foundCommand.startCommand(context, null);
        } else {
            await foundCommand.startCommand(context, ...args);
        }
    }

    private async parseCommand(message: Message): Promise<any[] | false> {
        // const guildPrefix: string | undefined = this.client.guildSettings.get(message.guild.id);
        let stringToLookAt = message.content;
        const guildPrefix = false;
        const prefix: string = guildPrefix ? guildPrefix : this.client.defaultPrefix;
        const startsWithPrefix = stringToLookAt.startsWith(prefix);
        if (!startsWithPrefix) {
            return false;
        }
        const commandRegex = /(^)\w+/;
        stringToLookAt = stringToLookAt.substring(prefix.length);
        const commandName = stringToLookAt.match(commandRegex);
        if (commandName === null) {
            return false; // RegEx failed
        }
        const command = this.client.commands.get(commandName[0]);
        if (command) {
            let argsToLookAt: string[] | null = stringToLookAt.substring(command.name.length + 1).trim().split(' ');
            if (argsToLookAt[0] === '') {
                argsToLookAt = null;
            }
            return [
                command,
                argsToLookAt,
            ];
        } else {
            return false;
        }
    }

    private argsToNames(args: ICommandArgument[]): string[] {
        return args.map((arg) => arg.key);
    }

    private argsToRequire(args: ICommandArgument[] | undefined): ICommandArgument[] | null {
        if (args === undefined) {
            return null;
        }
        return args.filter((arg) => !arg.default);
    }
    private async applyArgToType(message: Message, arg: string, pArg: ICommandArgument) {
        if (pArg.default && arg === undefined) {
            return pArg.default;
        } else if (arg === undefined) {
            return new Error(`Unparsed arg: ${pArg.key}`);
        }
        const argType = pArg.type;
        const typeHandler: CommandArgumentType | undefined = this.client.types[argType];
        if (typeHandler) {
            const validArg = await typeHandler.validate(arg, message, pArg);
            if (validArg) {
                return await typeHandler.parse(arg, message, pArg);
            } else {
                return new Error(`Could not parse ${arg} to a **${argType}**`);
            }
        } else {
            return new Error(`Could not find type ${argType} as a registered type`);
        }
    }

    private async parseArgs(
        message: Message,
        command: Command,
        args: string[]): Promise<any[] | string | null> {
        const requiredArguments = this.argsToRequire(command.args);
        if (requiredArguments !== null) {
            if (args === null) {
                return `Missing the ${this.argsToNames(requiredArguments).join(', ')} arguments`;
            } else {
                if (args.length < requiredArguments.length) {
                    return `Missing the ${this.argsToNames(requiredArguments.splice(requiredArguments.length - args.length))} arguments`;
                }
            }
        }
        return await this.applyArgsToType(args, command.args, message);
    }

    private async applyArgsToType(
        args: string[] | null,
        pArgs: ICommandArgument[] | undefined,
        message: Message): Promise<any[] | string | null> {
        if (args === null) {
            return null;
        } else if (pArgs === undefined) {
            return null;
        }
        const res: any[] = [];
        if (pArgs.length === 1) {
            const appliedType = await this.applyArgToType(message, args.join(' '), pArgs[0]);
            if (appliedType instanceof Error) {
                return appliedType.toString();
            }
            res.push(appliedType);
        } else {
            for (let i = 0; i < pArgs.length; i++) {
                let arg: string | null;
                arg = args[i];
                const pArg = pArgs[i];
                const appliedType = await this.applyArgToType(message, arg, pArg);
                if (appliedType instanceof Error) {
                    return appliedType.toString();
                }
                res.push(appliedType);
            }
        }
        return res;
    }
}

export { CommandHandler };
