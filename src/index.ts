import 'dotenv/config';
import Client from '#lib/structures/AliMusicClient';

const client = new Client();
// { path: './src/.env' }
const main = async () => {
    try {
        await client.build();
    } catch (err: any) {
        console.error(err);
        client.destroy();
		process.exit(1);
    }
}

main();