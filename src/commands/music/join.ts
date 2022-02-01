import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

import { 
    RequiredUserInVoice,
} from '#decorators/Voice';
import { getAudio } from '#utils/voice'; 

@ApplyOptions<CommandOptions>({
    name: "join",
    aliases: ['j'],
    description: "Join the voice channel",
    requiredClientPermissions: ['EMBED_LINKS', "CONNECT", "SPEAK"],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class JoinCMD extends Command {
    
        @RequiredUserInVoice()
        public async messageRun(message: Message) {
            // get the player instance
            const queue = getAudio(message.guild!);
            if (queue) {
                return message.channel.send(`Already in a voice channel`);
            }
            const connection = await message.guild!.me?.voice.setChannel(message.member?.voice.channel!);
            if (!connection) {
                return message.channel.send(`I am not in a voice channel`);
            }

            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle(`Success | Joined ${message.member!.voice.channel!.name}`)
                    .setDescription(`To leave the channel, run the \`leave\` command`)
                    .setColor('RANDOM')],
            });
        }
    }