import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, EmbedBuilder, VoiceBasedChannel } from 'discord.js';

import { 
    RequiredUserInVoice,
} from '#decorators/Voice';
import { getAudio } from '#utils/voice'; 

@ApplyOptions<CommandOptions>({
    name: "join",
    aliases: ['j'],
    description: "Join the voice channel",
    requiredClientPermissions: ['EmbedLinks', "Connect", "Speak"],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD'],
    enabled: false
})
export class JoinCMD extends Command {
    
        @RequiredUserInVoice()
        public async messageRun(message: Message) {
            const { distube } = this.container.client;
            const userVoice = message.member?.voice.channel as VoiceBasedChannel;
            // get the player instance
            const queue = getAudio(message.guild!);
            if (queue) {
                return message.channel.send(`Already in a voice channel`);
            }
            const connection = await message.guild!.voiceStates.cache.get(this.container.client.id!)!;
            if (!connection) {
                return message.channel.send(`I am not in a voice channel`);
            }

            // join the voice channel
            await distube.voices.join(userVoice);

            return message.channel.send({
                embeds: [new EmbedBuilder()
                    .setTitle(`Success | Joined ${message.member!.voice.channel!.name}`)
                    .setDescription(`To leave the channel, run the \`leave\` command`)
                    .setColor('Random')],
            });
        }
    }