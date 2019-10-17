/*
    Credits go to: https://github.com/auguwu/Nino/blob/master/src/structures/Context.ts
*/

import { Guild, Member, Message, TextChannel, User } from 'eris';
import { TGBLClient } from '../client';
// import MessageCollector from './MessageCollector';

export interface DMOptions {
    user: User;
    content: string;
    embed?: object;
}
class Context {
    public client: TGBLClient;
    public message: Message;
    public args: any[] | null;
    // public collector: MessageCollector;
    public guild: Guild;
    public sender: User;
    public me: Member;

    constructor(client: TGBLClient, message: Message, args: any[] | null) {
        Object.assign<this, Message>(this, message);

        this.client    = client;
        this.message   = message;
        this.args      = args;
        this.guild     = (message.channel as TextChannel).guild;
        this.sender    = message.author;
        // this.collector = new MessageCollector(client);
        this.me        = this.guild.members.get(client.user.id)!;
    }

    public async send(content: string) {
        return await this.message.channel.createMessage(content);
    }

    public async embed(content: object) {
        return await this.message.channel.createMessage({
            embed: content,
        });
    }

    public async code(lang: string, content: string) {
        const cb = '```';
        return await this.send(`${cb}${lang}\n${content}${cb}`);
    }

    public async dm(options: DMOptions) {
        const channel = await options.user.getDMChannel();
        return await channel.createMessage({
            content: options.content,
            embed: options.embed,
        });
    }
}

export { Context };
