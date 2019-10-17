import {TGBLClient} from '../client';

abstract class BaseHandler {
    public client: TGBLClient;
    public handlerName: string;

    protected constructor(client: TGBLClient, handlerName: string) {
        this.client = client;
        this.handlerName = handlerName;
    }
    public abstract run(...args: any[]): Promise<void>;
}

export { BaseHandler };
