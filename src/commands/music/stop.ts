import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "stop",
    description: "Stop current player",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class StopCMD extends Command {
    public run(message: Message) {
        // get the channel instance from the Member
        const voiceChannel = message.member?.voice.channel;
        // if user not in a voice channel
        if (!voiceChannel) return message.reply('you must in a voice channel to run command');
        // get the player instance
        const player = this.container.manager.players.get(message.guild?.id as string);
        if (!player) return message.reply('there is no player for this guild.');
        // if not in the same channel as the player,
        if (voiceChannel.id !== player.voiceChannel) return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild?.channels.cache.get(player.voiceChannel as string)?.name}\` to use command`);

        if (!player.queue.current) return message.reply('No song is currently playing in this guild.');

        // stop playing
        player.destroy();
        // send success message
        return message.channel.send('Stopped and left your Channel');
    }
}