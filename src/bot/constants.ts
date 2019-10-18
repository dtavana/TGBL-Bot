import {sendCustom, sendError, sendSuccess} from './embeds';
import {MessageEvent, ReadyEvent} from './events';
import {ConsoleLogger} from './logging';
import {LoggerCollection} from './structures/collections';
import * as ArgumentTypes from './structures/commands/ArgumentTypes';
import {CommandHandler} from './structures/handlers';

export const ARGUMENT_TYPES = {
    'boolean': ArgumentTypes.BooleanArgumentType,
    'category-channel': ArgumentTypes.CategoryChannelArgumentType,
    'channel': ArgumentTypes.ChannelArgumentType,
    'float': ArgumentTypes.FloatArgumentType,
    'integer': ArgumentTypes.IntegerArgumentType,
    'member': ArgumentTypes.MemberArgumentType,
    'role': ArgumentTypes.RoleArgumentType,
    'string': ArgumentTypes.StringArgumentType,
    'text-channel': ArgumentTypes.TextChannelArgumentType,
    'user': ArgumentTypes.UserArgumentType,
};

export const ALL_EMBEDS = {
    error: sendError,
    success: sendSuccess,
    custom: sendCustom,
};

export const ALL_HANDLERS = [
    CommandHandler,
];

export const ALL_EVENTS = [
    MessageEvent,
    ReadyEvent,
];

const ALL_LOGGERS: LoggerCollection = new LoggerCollection();
ALL_LOGGERS.set('console', new ConsoleLogger());
export { ALL_LOGGERS };
