import {TGBLClient} from '../../structures';
import {Command} from '../../structures/commands';

class UnbanCommand extends Command {
    constructor(client: TGBLClient) {
        super(client, __dirname, {
            name: 'unban',
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
            ],
        });
    }

    public async run(ctx, serverId, identifier) {
        const validServerId = await this.checkServerId(ctx.author.id, serverId);
        if (!validServerId) {
            return await this.client.sendMessage('error', this.client, ctx, `That server id is not bound to ${ctx.author.mention}`);
        }
        const res = await this.client.axios.post('bans/remove', {
            serverId,
            identifier,
        });
        // @ts-ignore
        const {msg, success} = res.data;
        if (!success) {
            return await this.client.sendMessage('error', this.client, ctx, msg);
        }
        await this.client.sendMessage('success', this.client, ctx, msg);
    }
    public async validate(ctx: any): Promise<string|true|void> {
        if (ctx.member.roles.includes(this.client.config.MOD_ROLE_ID)) {
            return true;
        } else {
            return await this.validateResponse('This command can only be used by TGBL admins');
        }
    }
    private async checkServerId(id, serverId) {
        return await this.client.pg.db.oneOrNone('SELECT * FROM servers WHERE ownerIdentifier = $1 AND serverId = $2;', [id, serverId]);
    }
}
export {UnbanCommand};
