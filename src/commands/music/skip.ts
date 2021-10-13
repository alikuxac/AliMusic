import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: 'skip',
    description: 'Skip current track',
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class SkipCMD extends Command{
    public async run(message: Message){
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
        if (player.queue.size == 0) {
			// if its on autoplay mode, then do autoplay before leaving...
			if (player.get('autoplay')) return this.container.manager.autoplay(player);
			// stop playing
			player.destroy();
			return message.channel.send('⏹ Stopped and left your Channel');
		}
		// skip the track
		player.stop();

		return message.channel.send('⏭ Skipped to the next Song');
    }
}