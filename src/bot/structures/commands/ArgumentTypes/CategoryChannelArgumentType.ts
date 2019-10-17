import { CategoryChannel, Message, TextChannel } from 'eris';
import { disambiguation } from '../../../utils';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class CategoryChannelArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'category-channel');
    }

    public async validate(val: string, msg: Message, arg: ICommandArgument) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^([0-9]+)$/);
        if (matches) {
            try {
                const channel = this.client.getChannel(matches[1]);
                if (!channel || !(channel instanceof CategoryChannel)) { return false; }
                return true;
            } catch (err) {
                return false;
            }
        }
        if (!textChannel.guild) { return false; }
        const search = val.toLowerCase();
        let channels = textChannel.guild.channels.filter(channelFilterInexact(search));
        if (channels.length === 0) { return false; }
        if (channels.length === 1) {
            return true;
        }
        const exactChannels = channels.filter(channelFilterExact(search));
        if (exactChannels.length === 1) {
            return true;
        }
        if (exactChannels.length > 0) { channels = exactChannels; }
        return channels.length <= 15 ?
            `${disambiguation(
                channels.map((chan) => chan.name), 'categories', undefined,
            )}\n` :
            'Multiple categories found. Please be more specific.';
    }

    public async parse(val, msg) {
        const matches = val.match(/^([0-9]+)$/);
        if (matches) { return msg.client.channels.get(matches[1]) || null; }
        if (!msg.guild) { return null; }
        const search = val.toLowerCase();
        const channels = msg.guild.channels.filter(channelFilterInexact(search));
        if (channels.size === 0) { return null; }
        if (channels.size === 1) { return channels.first(); }
        const exactChannels = channels.filter(channelFilterExact(search));
        if (exactChannels.size === 1) { return exactChannels.first(); }
        return null;
    }
}

function channelFilterExact(search) {
    return (chan) => chan.type === 'category' && chan.name.toLowerCase() === search;
}

function channelFilterInexact(search) {
    return (chan) => chan.type === 'category' && chan.name.toLowerCase().includes(search);
}

export { CategoryChannelArgumentType };
