import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { GuildMessage } from "#lib/types";
import { RequiredUserInVoice } from '#decorators/Voice';

@ApplyOptions<CommandOptions>({
    name: "play",
    aliases: ['p'],
    description: "Play music",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class PlayCMD extends Command {

    @RequiredUserInVoice()
    public async messageRun(message: GuildMessage, args: Args) {

        const search = await args.rest('string');
        if (!search) return message.channel.send('Please provide an url or a search term');

        this.container.distube.play(message.member.voice.channel!, search, {
            member: message.member,
            message: message,
            textChannel: message.channel
        });
    }
}