import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<CommandOptions>({
    name: "volume",
    description: "Change volume of current player",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class VolumeCMD extends Command {
    public async run(message: Message, args: Args) {
        // get the channel instance from the Member
        const voiceChannel = message.member?.voice.channel;
        // if user not in a voice channel
        if (!voiceChannel) return message.reply('you must in a voice channel to run command');
        // get the player instance
        const player = this.container.manager.players.get(message.guild?.id as string);
        // if not in the same channel --> return
        if (player && message.member.voice.channel.id !== player.voiceChannel) { return message.channel.send('You need to be in my voice channel to use this command!'); }
        if (!player) return message.reply('there is no player for this guild.');
        if (voiceChannel.id !== player?.voiceChannel) {
            return message.reply(`You need to be in my voice channel to use this command!. Join \`${message.guild?.channels.cache.get(player?.voiceChannel as string)?.name}\` to use command`);
        }

        const volume = await args.pick('number').catch(async () => {
            return await message.reply({ content: `The player volume is \`${player.volume}\`%.` })
        });
        if (!volume || volume < 1 || volume > 200) return message.reply('You need to give me a volume between 1 and 200.');

        player.setVolume(volume as number);
        return message.reply(`Set the player volume to \`${volume}\`%.`);

    }
}