import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions } from '@sapphire/framework';
import { Message, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } from 'discord.js';

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
    requiredClientPermissions: ['EmbedLinks'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class VolumeCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message) {
        const queue = getAudio(message.guild!);

        const minusTenButton = new ButtonBuilder().setCustomId('minus-ten').setStyle(ButtonStyle.Primary).setLabel('-10');
        const minusOneButton = new ButtonBuilder().setCustomId('minus-one').setStyle(ButtonStyle.Primary).setLabel('-1');
        const plusOneButton = new ButtonBuilder().setCustomId('plus-one').setStyle(ButtonStyle.Primary).setLabel('+1');
        const plusTenButton = new ButtonBuilder().setCustomId('plus-ten').setStyle(ButtonStyle.Primary).setLabel('+10');
        const stopButton = new ButtonBuilder().setCustomId('stop-volume').setStyle(ButtonStyle.Danger).setLabel('⏹')

        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            minusTenButton,
            minusOneButton,
            stopButton,
            plusOneButton,
            plusTenButton
        );

        const actionEmbed = new EmbedBuilder()
            .setTitle('Volume')
            .setDescription(`The player volume is \`${queue.volume}\`%.`)
            .setColor('Random')
            .setFooter({ text: 'Click on the buttons to change the volume.' })

        const actionMessage = await message.channel.send({ embeds: [actionEmbed], components: [actionRow] });
        const collector = actionMessage.createMessageComponentCollector({
            filter: (i) => {
                return i.user.id === message.author.id && ['minus-ten', 'minus-one', 'stop-volume', 'plus-one', 'plus-ten'].includes(i.customId)
            },
            time: 60000,
            componentType: ComponentType.Button
        })

        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'minus-ten':
                    const newMinusTenVolume = queue.volume - 10;
                    newMinusTenVolume < 0 ? queue.setVolume(0) : queue.setVolume(newMinusTenVolume);
                    collector.resetTimer();
                    await i.update({  embeds: [actionEmbed], components: [actionRow] });
                    break;
                case 'minus-one':
                    const newMinusOneVolume = queue.volume - 1;
                    newMinusOneVolume < 0 ? queue.setVolume(0) : queue.setVolume(newMinusOneVolume);
                    collector.resetTimer();
                    actionEmbed.setDescription(`The player volume is \`${queue.volume}\`%.`);
                    await i.update({ embeds: [actionEmbed], components: [actionRow] });
                    break;
                case 'stop-volume':
                    for (const component of actionRow.components) {
                        component.setDisabled(true);
                    }
                    await i.update({ embeds: [actionEmbed], components: [actionRow] });
                    collector.stop();
                    break;
                case 'plus-one':
                    const newPlusOneVolume = queue.volume + 1;
                    newPlusOneVolume > 200 ? queue.setVolume(200) : queue.setVolume(newPlusOneVolume);                    
                    collector.resetTimer();
                    actionEmbed.setDescription(`The player volume is \`${queue.volume}\`%.`);
                    await i.update({ content: 'Message currently disabled!', embeds: [actionEmbed], components: [actionRow] });
                    break;
                case 'plus-ten':
                    const newPlusTenVolume = queue.volume + 10;
                    newPlusTenVolume > 200 ? queue.setVolume(200) : queue.setVolume(newPlusTenVolume);
                    collector.resetTimer();
                    actionEmbed.setDescription(`The player volume is \`${queue.volume}\`%.`);
                    await i.update({ embeds: [actionEmbed], components: [actionRow] });
                    break;
            }
        })
    }
}