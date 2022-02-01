import { SapphireClient } from '@sapphire/framework';
import { container } from '@sapphire/pieces'
import { Enumerable } from '@sapphire/decorators';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
// import {
//     TextChannel,
//     MessageEmbed
// } from 'discord.js';

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
            youtubeDL: false,
            plugins: [new SpotifyPlugin()],
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
            queue.textChannel?.send(
                `Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`
            )
        });

        this.distube.on('deleteQueue', (queue) => {
            queue.textChannel?.send(`Deleted queue!`)
        })

        this.distube.on('disconnect', (queue) => {
            queue.textChannel?.send(`Disconnected from the queue!`)
        });

        this.distube.on('error', (channel, error) => {
            channel.send(`Error while playing: ${error}`)
        })

        this.distube.on('finish', queue => {
            queue.textChannel?.send("No more song in queue")
        });

        this.distube.on('initQueue', (queue) => {
            queue.autoplay = false;
            queue.volume = 100;
        })

        this.distube.on("noRelated", queue => {
            queue.textChannel?.send("Can't find related video to play.")
        });

        this.distube.on("playSong", (queue, song) => {
            queue.textChannel?.send(
                `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
            )
        });

        this.distube.on("searchCancel", (message) => {
            message.channel.send(`Searching canceled`)
        });

        this.distube.on("searchNoResult", (message, query) => { message.channel.send(`No result found for ${query}!`) });
        this.distube.on("searchResult", (message, results) => {
            message.channel.send(`**Choose an option from below**\n${results.map((song, i) => `**${i + 1}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
                }\n*Enter anything else or wait 60 seconds to cancel*`);
        });
        this.distube.on('searchInvalidAnswer', (message, answer, query) => {
            message.channel.send(`Invalid answer: ${answer} for ${query}!`)
        });
        this.distube.on('searchDone', (message, query) => {
            message.channel.send(`Search for ${query} done!`)
        })
    }

    public delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public msToHHMMSS(duration: number): string {
        let seconds: string | number = ((duration / 1000) % 60).toFixed(0),
            minutes: string | number = ((duration / (1000 * 60)) % 60).toFixed(0),
            hours: string | number = ((duration / (1000 * 60 * 60)) % 24).toFixed(0);

        hours = +hours < 10 ? '0' + hours : hours;
        minutes = +minutes < 10 ? '0' + minutes : minutes;
        seconds = +seconds < 10 ? '0' + seconds : seconds;

        return hours + ':' + minutes + ':' + seconds;
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