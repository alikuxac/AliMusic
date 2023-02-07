import { ApplyOptions } from '@sapphire/decorators';
import type { MessageCommandDeniedPayload, ListenerOptions } from '@sapphire/framework';
import { Listener, UserError, Events } from '@sapphire/framework';

@ApplyOptions<ListenerOptions>({
	event: Events.MessageCommandError,
})
export class UserEvent extends Listener {
	public async run({ context, message: content }: UserError, { message }: MessageCommandDeniedPayload) {
		// `context: { silent: true }` should make UserError silent:
		// Use cases for this are for example permissions error when running the `eval` command.
		if (Reflect.get(Object(context), 'silent')) return;

		return message.channel.send({ content, allowedMentions: { users: [message.author.id], roles: [] } });
	}
}