import {stripIndents} from 'common-tags';
import {TGBLClient} from '../../structures';
import {Command} from '../../structures/commands';

class EvalCommand extends Command {
    constructor(client: TGBLClient) {
        super(client, {
            name: 'eval',
            group: 'Utility',
            sendError: true,
            args: [
                {
                    key: 'evalString',
                    type: 'string',
                },
            ],
            ownerOnly: true,
        });
    }

    public async run(ctx, evalString) {
        const evalStringCleanedUp = this.cleanEval(evalString);
        let options: object;
        try {
            // tslint:disable-next-line:no-eval
            const res = eval(evalStringCleanedUp);
            let resStr: string;
            res === undefined ? resStr = 'undefined' : resStr = res.toString();
            options = {
                color: 65280,
                fields: [
                    {
                        name: 'Input',
                        value: evalStringCleanedUp,
                    },
                    {
                        name: 'Output',
                        value: resStr,
                    },
                ],
            };
        } catch (err) {
            options = {
                color: 16724480,
                fields: [
                    {
                        name: 'Input',
                        value: evalStringCleanedUp,
                    },
                    {
                        name: 'Error',
                        value: err.toString(),
                    },
                ],
            };
        }
        await this.client.sendMessage('custom', this.client, ctx, options);
    }

    public cleanEval(input: string) {
        return stripIndents(input);
    }
}

export {EvalCommand};
