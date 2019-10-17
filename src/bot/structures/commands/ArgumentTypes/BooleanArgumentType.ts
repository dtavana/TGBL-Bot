import { CommandArgumentType } from './index';

class BooleanArgumentType extends CommandArgumentType {
    private truthy: Set<string>;
    private falsy: Set<string>;
    constructor(client) {
        super(client, 'boolean');
        this.truthy = new Set(['true', 't', 'yes', 'y', 'on', 'enable', 'enabled', '1', '+']);
        this.falsy = new Set(['false', 'f', 'no', 'n', 'off', 'disable', 'disabled', '0', '-']);
    }

    public async validate(val) {
        const lc = val.toLowerCase();
        return this.truthy.has(lc) || this.falsy.has(lc);
    }

    public async parse(val) {
        const lc = val.toLowerCase();
        if (this.truthy.has(lc)) { return true; }
        if (this.falsy.has(lc)) { return false; }
        throw new RangeError('Unknown boolean value.');
    }
}

export { BooleanArgumentType };
