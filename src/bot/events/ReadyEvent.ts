import { TGBLClient } from '../structures';
import { BaseEvent } from './index';

class ReadyEvent extends BaseEvent {
    constructor(client: TGBLClient) {
        super(client, 'ready', () => {
            client.loggers.sendLog(`Now logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id}) with ${client.shards.size} Shard(s)`, 'console');
        });

    }
}

export { ReadyEvent };
