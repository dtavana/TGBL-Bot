import { GuildChannel, Message, TextChannel } from 'eris';
import { disambiguation } from '../../../utils';
import { CommandArgumentType } from './index';

class ChannelArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'channel');
    }

    public async validate(val: string, msg: Message, arg) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
        if (matches) { return textChannel.guild.channels.has(matches[1]); }
        const search = val.toLowerCase();
        let channels: GuildChannel[] = textChannel.guild.channels.filter(nameFilterInexact(search));
        if (channels.length === 0) { return false; }
        if (channels.length === 1) {
            if (arg.oneOf && !arg.oneOf.includes(channels[0].id)) { return false; }
            return true;
        }
        const exactChannels = channels.filter(nameFilterExact(search));
        if (exactChannels.length === 1) {
            if (arg.oneOf && !arg.oneOf.includes(exactChannels[0].id)) { return false; }
            return true;
        }
        if (exactChannels.length > 0) { channels = exactChannels; }
        return channels.length <= 15 ?
            `${disambiguation(channels.map((chan) => chan.name), 'channels', undefined)}\n` :
            'Multiple channels found. Please be more specific.';
    }

    public async parse(val: string, msg: Message) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
        if (matches) { return textChannel.guild.channels.get(matches[1]) || null; }
        const search = val.toLowerCase();
        const channels: GuildChannel[] = textChannel.guild.channels.filter(nameFilterInexact(search));
        if (channels.length === 0) { return null; }
        if (channels.length === 1) { return channels[0]; }
        const exactChannels = channels.filter(nameFilterExact(search));
        if (exactChannels.length === 1) { return exactChannels[0]; }
        return null;
    }
}

function nameFilterExact(search) {
    return (thing) => thing.name.toLowerCase() === search;
}

function nameFilterInexact(search) {
    return (thing) => thing.name.toLowerCase().includes(search);
}

export { ChannelArgumentType };
