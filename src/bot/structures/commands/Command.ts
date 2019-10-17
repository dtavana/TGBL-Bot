import {TGBLClient} from '../index';
import {Context} from './Context';
import {ICommandArgument, ICommandOptions} from './index';

abstract class Command implements ICommandOptions {
    public client: TGBLClient;
    public name: string;
    public group: string | undefined;
    // Optional Command Options
    public sendError: boolean | undefined;
    public aliases: string[] | undefined;
    public args: ICommandArgument[] | undefined;
    public ownerOnly: boolean | undefined;
    public permissions: string[] | undefined;

    protected constructor(client: TGBLClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.group = options.group;
        this.sendError = options.sendError;
        this.aliases = options.aliases;
        this.args = options.args;
        this.ownerOnly = options.ownerOnly;
        this.permissions = options.permissions;
    }

    public async startCommand(ctx, ...args) {
        await this.preCommand(ctx, args);
        const valid: string | true | void = await this.validate(ctx);
        if (!valid) {
            return await this.client.sendMessage('error', ctx, valid);
        }
        let res: any;
        try {
            res = await this.run(ctx, ...args);
        } catch (err) {
            return await this.postExecution(ctx, args, false, err);
        }
        await this.postExecution(ctx, args, true);
        await this.postCommand(ctx, args, res);

    }

    public async validate(ctx: any): Promise<string|true|void> {
        if (this.ownerOnly && !this.client.config.OWNERS) {
            return await this.validateResponse('This command may only be used by the owner');
        } else if (this.permissions !== undefined) {
            const memberPermissions = ctx.member.permissions;
            const unmetPermissions = this.permissions.filter(
                    (neededPermission) => !(memberPermissions.has(neededPermission)));
            if (unmetPermissions.length !== 0) {
                return await this.validateResponse(`Requires \`${unmetPermissions.join(', ')}`);
            }
        }
        return true;
    }

    public async validateResponse(payload: string): Promise<string|void> {
        if (this.sendError === true) {
            return payload;
        }
        return;
    }

    public async preCommand(ctx: Context, args: any[] | null) {
        return;
    }

    public async postExecution(ctx: Context, args: any[] | null, passed: boolean, err?: any) {
        if (!passed && err) {
            return await this.client.sendMessage('error', this.client, ctx, err);
        }
    }

    public async postCommand(ctx: Context, args: any[] | null, res: any) {
        return;
    }

    public abstract run(ctx: Context, ...args: any[]): Promise<void>;

}

export { Command };
