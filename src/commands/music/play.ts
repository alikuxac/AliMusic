import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { RequiredUserInVoice } from '#decorators/Voice';
import type { Message, GuildTextBasedChannel } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "play",
    aliases: ['p'],
    description: "Play music",
    requiredClientPermissions: ['EmbedLinks'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class PlayCMD extends Command {

    @RequiredUserInVoice()
    public async messageRun(message: Message, args: Args) {

        const search = await args.rest('string');
        if (!search) return message.channel.send('Please provide an url or a search term');

        this.container.distube.play(message.member?.voice.channel!, search, {
            message: message,
            member: message.member!,
            textChannel: message.channel as GuildTextBasedChannel
        });
    }
}