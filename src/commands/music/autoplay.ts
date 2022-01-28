import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { 
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice'; 
@ApplyOptions<CommandOptions>({
    name: "autoplay",
    aliases: ['ap'],
    description: "Toggle autoplay",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class AutoPlayCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public messageRun(message: Message) {
        // get the player instance
        const queue = getAudio(message.guild!);
        const autoplay = queue.toggleAutoplay()
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setTitle(`Success | ${autoplay ? 'Enabled' : 'Disabled'} Autoplay`)
                .setDescription(`To ${autoplay ? 'disable' : 'enable'} it, run this command again`)
                .setColor('RANDOM')],
        });
    }
}