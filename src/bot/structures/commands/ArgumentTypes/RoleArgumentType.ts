import { Message, TextChannel } from 'eris';
import { disambiguation } from '../../../utils';
import { ICommandArgument } from '../ICommandArgument';
import { CommandArgumentType } from './index';

class RoleArgumentType extends CommandArgumentType {
    constructor(client) {
        super(client, 'role');
    }

    public async validate(val: string, msg: Message, arg: ICommandArgument) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
        if (matches) { return textChannel.guild.roles.has(matches[1]); }
        const search = val.toLowerCase();
        let roles = textChannel.guild.roles.filter(this.nameFilterInexact(search));
        if (roles.length === 0) { return false; }
        if (roles.length === 1) {
            return true;
        }
        const exactRoles = roles.filter(this.nameFilterExact(search));
        if (exactRoles.length === 1) {
            return true;
        }
        if (exactRoles.length > 0) { roles = exactRoles; }
        return roles.length <= 15 ?
        `${disambiguation(roles.map((role) => `${role.name}`), 'roles', undefined)}\n` :
        'Multiple roles found. Please be more specific.';
    }

    public async parse(val: string, msg: Message) {
        const textChannel = (msg.channel as TextChannel);
        const matches = val.match(/^(?:<@&)?([0-9]+)>?$/);
        if (matches) { return textChannel.guild.roles.get(matches[1]) || null; }
        const search = val.toLowerCase();
        const roles = textChannel.guild.roles.filter(this.nameFilterInexact(search));
        if (roles.length === 0) { return null; }
        if (roles.length === 1) { return roles[0]; }
        const exactRoles = roles.filter(this.nameFilterExact(search));
        if (exactRoles.length === 1) { return exactRoles[0]; }
        return null;
    }

    private nameFilterExact(search) {
        return (thing) => thing.name.toLowerCase() === search;
    }
    private nameFilterInexact(search) {
        return (thing) => thing.name.toLowerCase().includes(search);
    }
}

export { RoleArgumentType };
