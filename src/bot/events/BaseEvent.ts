import {TGBLClient} from '../structures';

class BaseEvent {
    public client: TGBLClient;
    private readonly _name: string;
    private readonly _func: (args: any[]) => any;
    constructor(client: TGBLClient, name: string, func: (...args: any[]) => any) {
        this._name = name;
        client.loggers.sendLog(`Setting up ${this._name} event`, 'console');
        this.client = client;
        this._func = func;
        this.client.on(this._name, this._func);
        client.loggers.sendLog(`Done setting up ${this._name} event`, 'console');
    }
}

export { BaseEvent };
