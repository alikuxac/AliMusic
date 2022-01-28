import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import type { Message } from 'discord.js';

import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';

@ApplyOptions<CommandOptions>({
    name: "volume",
    description: "Change volume of current player",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class VolumeCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message, args: Args) {
        const queue = getAudio(message.guild!);

        const volume = await args.pick('number').catch(async () => {
            return await message.reply({ content: `The player volume is \`${queue.volume}\`%.` })
        });
        if (!volume || volume < 1 || volume > 200) return await message.reply('You need to give me a value between 1 and 200.');

        queue.setVolume(<number>volume);
        return message.reply(`Set the player volume to \`${volume}\`%.`);

    }
}