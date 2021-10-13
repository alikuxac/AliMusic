import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import type { SearchResult } from 'erela.js'

@ApplyOptions<CommandOptions>({
    name: "play",
    aliases: ['p'],
    description: "Play music",
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD']
})
export class PlayCMD extends Command {
    public async run(message: Message, args: Args) {
        // get the channel instance from the Member
        const voiceChannel = message.member?.voice.channel;
        // if user not in a voice channel
        if (!voiceChannel) return message.reply('you must in a voice channel to run command');
        // get the player instance
        const player = this.container.manager.players.get(message.guild?.id as string);
        // f not in the same channel --> return
        if (player && message.member.voice.channel.id !== player.voiceChannel) { return message.channel.send('You need to be in my voice channel to use this command!'); }

        // Create the player
        const newplayer = this.container.manager.create({
            guild: message.guild?.id as string,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
        });

        const search = await args.rest('string')
        if (!search) return message.reply({ content: 'Invalid value', allowedMentions: { repliedUser: false } });

        let res: SearchResult | null;

        try {
            // Search for tracks using a query or url, using a query searches youtube automatically and the track requester object
            res = await this.container.manager.search({ query: search });
        }
        catch (err: any) {
            return message.reply(`There was an error while searching: ${err.message}`);
        }

        switch (res.loadType) {
            case 'LOAD_FAILED':
                return message.channel.send({ content: res.exception?.message });
            case 'NO_MATCHES':
                return message.channel.send('There was no tracks found with that query.');
            case 'TRACK_LOADED':
                newplayer.queue.add(res.tracks[0]);
                message.channel.send(`Enqueuing ${res.tracks[0].title}.`);

                if (newplayer.state !== 'CONNECTED') {
                    newplayer.connect();
                    newplayer.set('playerauthor', message.author.id);
                    newplayer.play();
                }
                else if (!newplayer.playing) {
                    newplayer.play();
                }
                break;
            case 'PLAYLIST_LOADED':
                newplayer.queue.add(res.tracks);
                message.channel.send(`Enqueuing ${res.playlist?.name}.`);

                if (newplayer.state !== 'CONNECTED') {
                    newplayer.connect();
                    newplayer.set('playerauthor', message.author.id);
                    newplayer.play();
                }
                else if (!newplayer.playing) {
                    newplayer.play();
                }
                break;
            case 'SEARCH_RESULT':
                let max = 10;
                const filter = (m: Message) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
                if (res.tracks.length < max) max = res.tracks.length;
                const results = res.tracks
                    .slice(0, max)
                    .map((track, index) => `${++index} - \`${track.title}\``)
                    .join('\n');
                const resultsEmbed = new MessageEmbed()
                    .setTitle('Select a song to play and send the number next to it. You have 30 seconds to select.')
                    .setDescription(results)
                    .setColor('RANDOM')
                    .setFooter('Use "end" to cancel');
                const resultMsg = await message.channel.send({ embeds: [resultsEmbed] });

                const collected = await message.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 30e3,
                    errors: ['time'],
                })

                const first = collected.first()?.content;
                if (first?.toLowerCase() === 'end') {
                    await resultMsg.delete().catch();
                    return message.channel.send(':white_check_mark: | Cancelled selection.');
                }

                const index = Number(first) - 1;
                if (index < 0 || index > max - 1) {
                    await resultMsg.delete().catch();

                    return message.channel.send(
                        `:x: | The number you provided is too small or too big (1-${max}).`,
                    );
                }
                const track = res.tracks[index];
                newplayer.queue.add(track);
                await resultMsg.delete().catch();
                message.channel.send(`:white_check_mark: | **Enqueuing:** \`${track.title}\`.`);

                if (newplayer.state !== 'CONNECTED') {
                    newplayer.connect();
                    newplayer.set('playerauthor', message.author.id);
                    newplayer.play();
                }
                else if (!newplayer.playing) {
                    newplayer.play();
                }
                break;
            default:
                break;
        }
    }
}