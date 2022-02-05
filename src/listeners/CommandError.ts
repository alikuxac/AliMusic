import { CommandErrorPayload, Events, Listener, ListenerOptions, UserError } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<ListenerOptions>({
    event: Events.CommandError,
})
export class UserEvent extends Listener {
    public async run({ context, message: content }: UserError, { message }: CommandErrorPayload) {
        if (Reflect.get(Object(context), 'silent')) return;
        return message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } });
    }
}