import { SapphireClient } from '@sapphire/framework';
import { container } from '@sapphire/pieces'
import { Enumerable } from '@sapphire/decorators';
import { DisTube, SearchResultType } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { EmbedBuilder } from 'discord.js';

import { CLIENT_OPTIONS, TOKEN } from '#root/configs';

export default class AliMusicClient extends SapphireClient {
    @Enumerable(false)
    public distube: DisTube;

    constructor() {
        super(CLIENT_OPTIONS);

        this.distube = new DisTube(this, {
            leaveOnStop: false,
            leaveOnEmpty: false,
            searchSongs: 10,
            plugins: [new SpotifyPlugin(), new SoundCloudPlugin(), new YtDlpPlugin()],
        });
        container.distube = this.distube;
        this.loadDistubeEvent();

    }

    public async start() {
        await this.login(TOKEN);
    }

    private loadDistubeEvent() {
        this.distube.on('addList', (queue, playlist) => {
            queue.textChannel?.send(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue!`)
        })

        this.distube.on("addSong", (queue, song) => {
            queue.textChannel?.send({
                embeds: [new EmbedBuilder()
                    .setDescription(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user?.tag}.`)
                    .setColor('Green')
                ]
            })
        });
    
        this.distube.on('deleteQueue', (queue) => {
            queue.textChannel?.send(`Deleted queue!`)
        })

        this.distube.on('disconnect', (queue) => {
            queue.pause();
            queue.textChannel?.send(`Disconnected from the queue!`)
        });

        this.distube.on('error', (channel, error) => {
            channel ? channel.send(`Error while playing: ${error}`) : console.error(error);
        })

        this.distube.on('finish', queue => {
            queue.textChannel?.send("No more song in queue")
        });

        this.distube.on('initQueue', (queue) => {
            queue.autoplay = false;
            queue.volume = 100;
            queue.repeatMode = 0;
        })

        this.distube.on("noRelated", queue => {
            queue.textChannel?.send("Can't find related video to play.")
        });

        this.distube.on("playSong", (queue, song) => {
            queue.textChannel?.send(
                `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user?.tag}`
            )
        });

        this.distube.on("searchCancel", (message) => {
            message.channel.send(`Searching canceled`)
        });

        this.distube.on("searchNoResult", (message, query) => {
            message.channel.send(`No result found for ${query}!`)
        });
        this.distube.on("searchResult", (message, results) => {
            const searchResultEmbed = new EmbedBuilder()
                .setTitle(`Search results for ${results}`)
                .setDescription(`**Choose an option from below**\n${results.map((song, i) => `**${i + 1}**. ${song.name}${song.type === SearchResultType.VIDEO ? ` -\`${song.formattedDuration}\`` : ''}`).join("\n")
                    }\n*Enter anything else or wait 60 seconds to cancel*`)
                .setColor('Random')
            message.channel.send({ embeds: [searchResultEmbed] });
        });

        this.distube.on('searchInvalidAnswer', (message, answer, query) => {
            message.channel.send(`Invalid answer: ${answer} for ${query}!`)
        });

        this.distube.on('searchDone', (message, query) => {
            message.channel.send(`Search for ${query} done!`)
        })
    }

}

declare module '@sapphire/pieces' {
    interface Container {
        // manager: Player;
        distube: DisTube;
    }
}

declare module 'discord.js' {
    interface Client {
        // manager: Player
        distube: DisTube;
    }
}