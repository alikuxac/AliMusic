import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Check current track',
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class NPCmd extends Command {
    public run(message: Message) {
        // get the channel instance from the Member
        const voiceChannel = message.member?.voice.channel;
        // if user not in a voice channel
        if (!voiceChannel) return message.reply('you must in a voice channel to run command');
        // get the player instance
        const player = this.container.manager.players.get(message.guild?.id as string);
        // f not in the same channel --> return
        if (player && message.member.voice.channel.id !== player.voiceChannel) { return message.channel.send('You need to be in my voice channel to use this command!'); }
        if (!player) return message.reply('there is no player for this guild.');
        if (voiceChannel.id !== player?.voiceChannel) {
            return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild?.channels.cache.get(player?.voiceChannel as string)?.name}\` to use command`);
        }
        const current = player?.queue.current;
        const embed = new MessageEmbed()
            .setAuthor(current?.author as string)
            .setDescription(`Now playing: [${current?.title}](${current?.uri}) (${this.container.manager.format(current?.duration as number)})`)
            .setThumbnail(current?.thumbnail as string)
            .setFooter(`Requested by ${current?.requester}`);

        return message.channel.send({ embeds: [embed] });
    }
}