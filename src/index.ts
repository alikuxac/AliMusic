import 'dotenv/config';
import { connect } from 'mongoose';

import Client from '#lib/structures/AliMusicClient';
import { MONGO } from '#root/configs';

const client = new Client();
(async () => {
    try {
        await connect(MONGO, { dbName: 'AliMusic' });
        console.log('Connected to MongoDB');
        await client.start();
    } catch (err: any) {
        console.error(err);
        client.destroy();
        process.exit(1);
    }
})();