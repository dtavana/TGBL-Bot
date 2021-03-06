interface ITGBLClientConfig {
    DEFAULT_PREFIX: string;
    BOT_TOKEN: string;
    PG_CONNECTION: string;
    OWNERS: string[];
    FOOTER_TEXT: string;
    MOD_ROLE_ID: string;
    API_PORT: number;
    API_SUPER_TOKEN: string;
}

export { ITGBLClientConfig };
