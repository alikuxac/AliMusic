declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN: string;
            OWNERS: string;
            PREFIX: string;
            MONGO: string;
        }
    }
}

export { }