import {TGBLClient} from '../structures';
import {Context} from '../structures/commands';

const sendCustom = async (client: TGBLClient, ctx: Context, options: object): Promise<void> => {
    const embed = {
        author: {
            icon_url: ctx.sender.avatarURL,
            name: ctx.sender.username,
        },
        color: 16711850,
        footer: {
            text: client.config.FOOTER_TEXT,
        },
        title: 'Custom Embed',
    };
    Object.assign<object, object>(embed, options);
    await ctx.embed(embed);
};

export {sendCustom};
