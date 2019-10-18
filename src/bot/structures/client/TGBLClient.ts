import axios, {AxiosInstance} from 'axios';
import {Client} from 'eris';
import {join} from 'path';
import * as constants from '../../constants';
import {sendMessage} from '../../embeds';
import {PostgresManager} from '../../managers';
import {LoggerCollection} from '../collections';
import {Command} from '../commands';
import {BaseHandler} from '../handlers';
import {ITGBLClientConfig} from '../index';

class TGBLClient extends Client {
    public axios: AxiosInstance;
    public config: ITGBLClientConfig;
    public defaultPrefix: string;
    public types: object;
    public loggers: LoggerCollection;
    public handlers: BaseHandler[];
    public sendMessage: (func: any, ...data: any[]) => Promise<void>;
    public commands: Map<string, Command>;
    public pg: PostgresManager;
    constructor(config: ITGBLClientConfig) {
        super(
            config.BOT_TOKEN,
            {
                disableEvents: {
                    /*
                    "CHANNEL_CREATE": true,
                    "CHANNEL_DELETE": true,
                    "CHANNEL_UPDATE": true,
                    "GUILD_BAN_ADD": true,
                    "GUILD_BAN_REMOVE": true,
                    "GUILD_MEMBER_REMOVE": true,
                    "GUILD_MEMBER_UPDATE": true,
                    "GUILD_ROLE_CREATE": true,
                    "GUILD_UPDATE": true,
                    "MESSAGE_CREATE": true,
                    "MESSAGE_DELETE": true,
                    "MESSAGE_DELETE_BULK": true
                    "PRESCENCE_UPDATE": true,
                    */
                    TYPING_START: true,
                    /*
                    "USER_UPDATE": true,
                    "VOICE_STATUS_UPDATE": true,
                    */
                },
                maxShards: 'auto',

            },
        );
        this.config = config;
        this.axios = axios.create({
            baseURL: `http://localhost:${config.API_PORT}/api/`,
            headers: {Authorization: config.API_SUPER_TOKEN},
            validateStatus: () => true,
        });
        this.loggers = constants.ALL_LOGGERS;
        this.commands = new Map();
        this.defaultPrefix = config.DEFAULT_PREFIX;
        this.sendMessage = sendMessage;
        this.types = {};
        for (const type of Object.entries(constants.ARGUMENT_TYPES)) {
            const typeName = type[0];
            const typeHandler = type[1];
            this.loggers.sendLog(`Argument ${typeName} is now trying to register`, 'console');
            this.types[typeName] = new typeHandler(this);
            this.loggers.sendLog(`Argument ${typeName} is now registered`, 'console');
        }
        this.handlers = [];
        for (const handle of constants.ALL_HANDLERS) {
            const handler = new handle(this);
            this.loggers.sendLog(`Handler ${handle.name} is now registered`, 'console');
            this.handlers.push(handler);
        }

        for (const event of constants.ALL_EVENTS) {
            new event(this);
        }

        this.addListener('handle-message', async (...data) => {
            for (const handle of this.handlers) {
                await handle.run(...data);
            }
        });

        this.registerCommands(join(__dirname, '../../', 'commands'));

        this.pg = new PostgresManager(this);
        this.connect().then(); // Connect to discord
    }
    private registerCommands(path: string) {
        const obj: object = require('require-all')(path);
        for (const group of Object.values(obj)) {
            for (let command of Object.values(group)) {
                if (typeof command !== 'function') { command = Object.values(command as object)[0]; }
                // @ts-ignore
                const newCommand: Command = new command(this);
                this.commands.set(newCommand.name, newCommand);
                if (newCommand.aliases) {
                    for (const alias of newCommand.aliases) {
                        this.commands.set(alias, newCommand);
                    }
                }
                this.loggers.sendLog(`Command ${newCommand.name} is now registered`, 'console');
            }
        }
    }
}

export { TGBLClient };
