import {TGBLClient} from '../structures';
import {Context} from '../structures/commands';

const sendSuccess = async (client: TGBLClient, ctx: Context, res: string): Promise<void> => {
    const embed = {
        author: {
            icon_url: ctx.sender.avatarURL,
            name: ctx.sender.username,
        },
        color: 65280,
        description: res,
        footer: {
            text: client.config.FOOTER_TEXT,
        },
        title: 'Success',
    };
    await ctx.embed(embed);
};

export {sendSuccess};
