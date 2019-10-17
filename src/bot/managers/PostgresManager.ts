import pgPromise from 'pg-promise';
import { ITGBLClientConfig, TGBLClient } from '../structures';

class PostgresManager {
    public db: any;
    private _client: TGBLClient;
    private _config: ITGBLClientConfig;
    constructor(client: TGBLClient) {
        this._client = client;
        this._config = this._client.config;
        const pgp = pgPromise();
        this.db = pgp(this._config.PG_CONNECTION);
        this._client.loggers.sendLog('Postgres DB Connected', 'console', 'database');
        this.init().then();
    }
    public async init(): Promise<void> {
        // Initialize tables here
        this._client.loggers.sendLog('Postgres Tables initialized', 'console', 'database');
    }

}

export { PostgresManager };
