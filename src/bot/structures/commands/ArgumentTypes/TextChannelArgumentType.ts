import { GuildChannel, Message, TextChannel } from 'eris';
import { disambiguation } from '../../../utils';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class TextChannelArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'text-channel');
    }

    public async validate(val: string, msg: Message, arg: ICommandArgument) {
        const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
        const textChannel = (msg.channel as TextChannel);
        if (matches) {
            try {
                const channel = this.client.getChannel(matches[1]);
                return !(!channel || !(channel instanceof TextChannel));
            } catch (err) {
                return false;
            }
        }
        if (!textChannel.guild) { return false; }
        const search = val.toLowerCase();
        let channels = textChannel.guild.channels.filter(this.channelFilterInexact(search));
        if (channels.length === 0) { return false; }
        if (channels.length === 1) {
            return true;
        }
        const exactChannels = channels.filter(this.channelFilterExact(search));
        if (exactChannels.length === 1) {
            return true;
        }
        if (exactChannels.length > 0) { channels = exactChannels; }
        return channels.length <= 15 ?
                `${disambiguation(
                    channels.map((chan) => chan.name), 'text channels', undefined,
                )}\n` :
                'Multiple text channels found. Please be more specific.';
    }

    public async parse(val: string, msg: Message) {
        const matches = val.match(/^(?:<#)?([0-9]+)>?$/);
        const textChannel = (msg.channel as TextChannel);
        if (matches) { return this.client.getChannel(matches[1]) || null; }
        if (!textChannel.guild) { return null; }
        const search = val.toLowerCase();
        const channels = textChannel.guild.channels.filter(this.channelFilterInexact(search));
        if (channels.length === 0) { return null; }
        if (channels.length === 1) { return channels[0]; }
        const exactChannels = channels.filter(this.channelFilterExact(search));
        if (exactChannels.length === 1) { return exactChannels[0]; }
        return null;
    }

    private channelFilterExact(search) {
        return (chan: GuildChannel) => chan instanceof TextChannel && chan.name.toLowerCase() === search;
    }
    private channelFilterInexact(search) {
        return (chan: GuildChannel) => chan instanceof TextChannel && chan.name.toLowerCase().includes(search);
    }
}

export { TextChannelArgumentType };
