import {Message} from 'eris';
import {TGBLClient} from '../structures';
import {BaseEvent} from './index';

class MessageEvent extends BaseEvent {
    constructor(client: TGBLClient) {
        super(client, 'messageCreate', async (message: Message) => {
            client.emit('handle-message', message);
        });
    }
}

export { MessageEvent };
