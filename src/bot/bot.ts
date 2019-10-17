import {readFileSync} from 'fs';
import {safeLoad} from 'js-yaml';
import {ITGBLClientConfig, TGBLClient} from './structures';

export default () => {
    const config: ITGBLClientConfig = safeLoad(readFileSync('bot.yml', 'utf8'));
    return new TGBLClient(config);
};
