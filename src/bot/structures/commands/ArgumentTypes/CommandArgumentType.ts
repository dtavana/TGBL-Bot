import { Message } from 'eris';
import { TGBLClient } from '../../client';
import { ICommandArgument } from '../index';

class CommandArgumentType {
    public client: TGBLClient;
    public name: string;
    constructor(client: TGBLClient, name: string) {
        this.name = name;
        this.client = client;
    }
    public async validate(val: string, message: Message, arg: ICommandArgument): Promise<any> {
        throw new Error(`${this.name} does not have a validate function implemented`);
    }
    public async parse(val: string, message: Message, arg: ICommandArgument): Promise<any> {
        throw new Error(`${this.name} does not have a parse function implemented`);
    }
    public async isEmpty(val: string, message: Message, arg: ICommandArgument): Promise<any> {
        throw new Error(`${this.name} does not have a isEmpty function implemented`);
    }
}

export { CommandArgumentType };
