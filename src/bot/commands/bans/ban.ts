import {TGBLClient} from '../../structures';
import {Command} from '../../structures/commands';

class BanCommand extends Command {
    constructor(client: TGBLClient) {
        super(client, {
            name: 'ban',
            group: 'Bans',
            sendError: true,
            args: [
                {
                    key: 'serverId',
                    type: 'string',
                },
                {
                    key: 'identifier',
                    type: 'string',
                },
                {
                    key: 'reason',
                    type: 'string',
                },
            ],
            ownerOnly: true,
        });
    }

    public async run(ctx, serverId, identifier, reason) {
        const validServerId = await this.checkServerId(ctx.author.id, serverId);
        if (!validServerId) {
            return await this.client.sendMessage('error', this.client, ctx, `That server id is not bound to ${ctx.author.tag}`);
        }
        const res = await this.client.axios.post('bans/add', {
            serverId,
            identifier,
            reason,
        });
        // @ts-ignore
        const {msg, success} = res.data;
        if (!success) {
            return await this.client.sendMessage('error', this.client, ctx, msg);
        }
        await this.client.sendMessage('success', this.client, ctx, msg);
    }
    private async checkServerId(id, serverId) {
        return await this.client.pg.db.oneOrNone('SELECT * FROM servers WHERE ownerIdentifier = $1 AND serverId = $2;', [id, serverId]);
    }
}
export {BanCommand};
