import { Precondition } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { OWNERS } from '#root/configs';

export class OwnerOnly extends Precondition {
    public run(message: Message) {
        return OWNERS.includes(message.author.id) ? this.ok() : this.error({ context: { silent: true }, message: 'This command can run by BotOwner only.' });
    }
}

declare module '@sapphire/framework' {
    interface Preconditions {
        OwnerOnly: never
    }
}