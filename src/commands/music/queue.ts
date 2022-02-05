import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed, MessageActionRow, MessageButton } from 'discord.js';
import _ from 'lodash';
import {
    RequiredUserInVoice,
    RequireSameVoiceChannel,
    RequiredBotInVoice,
    PlayerExists
} from '#decorators/Voice';
import { getAudio } from '#utils/voice';
@ApplyOptions<CommandOptions>({
    name: "queue",
    aliases: ['q'],
    description: "Check queue",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class QueueCMD extends Command {

    @RequiredUserInVoice()
    @RequiredBotInVoice()
    @RequireSameVoiceChannel()
    @PlayerExists()
    public async messageRun(message: Message, args: Args) {


        const page = await args.pick('number').catch(() => 0);
        const queue = getAudio(message.guild!);

        const QueueEmbed = new MessageEmbed()
            .setAuthor({ name: `Queue for ${message.guild?.name}  -  [ ${queue.songs.length} Tracks ]`, iconURL: <string>message.guild?.iconURL({ dynamic: true }) });
        // get the right tracks of the current tracks
        const tracks = queue.songs;
        // if there are no other tracks, information

        if (queue.playing) QueueEmbed.addField('Current', `**[${tracks[0].name}](${tracks[0].url})**`);

        const multiple = 10;
        let start = 0;  

        if (tracks.length < 11) {
            if (!tracks.length) {
                QueueEmbed.setDescription(`No song in ${page > 1 ? `page ${page}` : 'the queue'}`);
            } else {
                QueueEmbed.setDescription(tracks
                .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                .join('\n'));
            }
            
            return message.channel.send({ embeds: [QueueEmbed] });
        }

        const chunkArray = _.chunk(tracks, multiple);
        let currentPage = 0;
        let pageChunkArray = chunkArray[currentPage];

        QueueEmbed.setDescription(pageChunkArray
            .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
            .join('\n'));

        QueueEmbed.setFooter({ text: `Page ${currentPage} of ${chunkArray.length}` });
        QueueEmbed.setColor('RANDOM');

        const firstButton = new MessageButton().setCustomId('first-queue').setStyle('PRIMARY').setLabel('⏪');
        const lastButton = new MessageButton().setCustomId('last-queue').setStyle('PRIMARY').setLabel('⏩');
        const previousButton = new MessageButton().setCustomId('previous-queue').setStyle('PRIMARY').setLabel('◀');
        const nextButton = new MessageButton().setCustomId('next-queue').setStyle('PRIMARY').setLabel('▶');

        const actionRow = new MessageActionRow()
            .setComponents(firstButton, previousButton, nextButton, lastButton);

        const QueueMessage = await message.channel.send({ embeds: [QueueEmbed], components: [actionRow] });
        const collector = QueueMessage.createMessageComponentCollector({
            filter: (i) => {
                return i.user.id === message.author.id && ['first-queue', 'last-queue', 'previous-queue', 'next-queue'].includes(i.customId);
            },
            time: 60000,
            componentType: 'BUTTON'
        });
    
        collector.on('collect', async (i) => {
            switch (i.customId) {
                case 'first-queue':
                    currentPage = 0;
                    start = 0;
                    pageChunkArray = chunkArray[currentPage];
                    QueueEmbed.setDescription(pageChunkArray
                        .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                        .join('\n'));
                    QueueEmbed.setFooter({ text: `Page ${currentPage} of ${chunkArray.length}` });
                    await i.update({ embeds: [QueueEmbed], components: [actionRow] });
                    break;
                case 'last-queue':
                    currentPage = chunkArray.length - 1;
                    start = currentPage * multiple;
                    pageChunkArray = chunkArray[currentPage];
                    QueueEmbed.setDescription(pageChunkArray
                        .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                        .join('\n'));
                    QueueEmbed.setFooter({ text: `Page ${currentPage} of ${chunkArray.length}` });
                    await i.update({ embeds: [QueueEmbed], components: [actionRow] });
                    break;
                case 'previous-queue':
                    currentPage--;
                    if (currentPage < 0) currentPage = 0;
                    start = currentPage * multiple;
                    pageChunkArray = chunkArray[currentPage];
                    QueueEmbed.setDescription(pageChunkArray
                        .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                        .join('\n'));
                    QueueEmbed.setFooter({ text: `Page ${currentPage} of ${chunkArray.length}` });
                    await i.update({ embeds: [QueueEmbed], components: [actionRow] });
                    break;
                case 'next-queue':
                    currentPage++;
                    if (currentPage > chunkArray.length - 1) currentPage = chunkArray.length - 1;
                    start = currentPage * multiple;
                    pageChunkArray = chunkArray[currentPage];
                    QueueEmbed.setDescription(pageChunkArray
                        .map((track, i) => `${start + ++i} - [${track.name}](${track.url})`)
                        .join('\n'));
                    QueueEmbed.setFooter({ text: `Page ${currentPage} of ${chunkArray.length}` });
                    await i.update({ embeds: [QueueEmbed], components: [actionRow] });
                    break;
            }
        })

        collector.on('end', async () => {
            for (const component of actionRow.components) {
                component.setDisabled(true);
            }
            await QueueMessage.edit({ embeds: [QueueEmbed], components: [actionRow] });
        })
    }
}