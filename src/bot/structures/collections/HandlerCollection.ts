import { BaseHandler } from '../handlers';

class HandlerCollection extends Map<string, BaseHandler> {
    constructor() {
        super();
    }
}

export { HandlerCollection };
