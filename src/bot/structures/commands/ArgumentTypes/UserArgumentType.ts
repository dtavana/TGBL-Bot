import { Message, TextChannel } from 'eris';
import { disambiguation } from '../../../utils';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class UserArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'user');
    }

    public async validate(val: string, msg: Message, arg: ICommandArgument) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
        if (matches) {
            try {
                let user = this.client.users.get(matches[1]);
                if (!user) {
                    user = await this.client.getRESTUser(matches[1]);
                    if (!user) {
                        return false;
                    }
                }
                return true;
            } catch (err) {
                return false;
            }
        }
        if (!textChannel.guild) { return false; }
        const search = val.toLowerCase();
        let members = textChannel.guild.members.filter(this.memberFilterInexact(search));
        if (members.length === 0) { return false; }
        if (members.length === 1) {
            return true;
        }
        const exactMembers = members.filter(this.memberFilterExact(search));
        if (exactMembers.length === 1) {
            return true;
        }
        if (exactMembers.length > 0) { members = exactMembers; }
        return members.length <= 15 ?
            `${disambiguation(
                members.map((mem) => `${mem.user.username}#${mem.user.discriminator}`), 'users', undefined,
            )}\n` :
            'Multiple users found. Please be more specific.';
    }

    public async parse(val: string, msg: Message) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<@!?)?([0-9]+)>?$/);
        if (matches) { return this.client.users.get(matches[1]) || null; }
        if (!textChannel.guild) { return null; }
        const search = val.toLowerCase();
        const members = textChannel.guild.members.filter(this.memberFilterInexact(search));
        if (members.length === 0) { return null; }
        if (members.length === 1) { return members[0].user; }
        const exactMembers = members.filter(this.memberFilterExact(search));
        if (exactMembers.length === 1) { return exactMembers[0].user; }
        return null;
    }

    private memberFilterExact(search) {
        return (mem) => mem.user.username.toLowerCase() === search ||
            (mem.nickname && mem.nickname.toLowerCase() === search) ||
            `${mem.user.username.toLowerCase()}#${mem.user.discriminator}` === search;
    }
    private memberFilterInexact(search) {
        return (mem) => mem.user.username.toLowerCase().includes(search) ||
            (mem.nickname && mem.nickname.toLowerCase().includes(search)) ||
            `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search);
    }
}

export { UserArgumentType };
