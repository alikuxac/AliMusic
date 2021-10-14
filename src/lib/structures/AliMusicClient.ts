import { SapphireClient } from '@sapphire/framework';
import { container } from '@sapphire/pieces'
import { Enumerable } from '@sapphire/decorators';
import { TextChannel, Guild, MessageEmbed, User } from 'discord.js';


import { CLIENT_OPTIONS, TOKEN } from '#root/configs';
import { nodes } from '#root/config/nodes'
import Player from '#lib/structures/Player'

export default class AliMusicClient extends SapphireClient {
    @Enumerable(false)
    public manager: Player;

    constructor() {
        super(CLIENT_OPTIONS);

        this.manager = new Player({
            nodes: nodes,
            send: (id, payload) => {
                const guild = this.guilds.cache.get(id);
                if (guild) guild.shard.send(payload);
            },
            autoPlay: true,
        }, this);
        container.manager = this.manager;
    }

    public async build() {
        await this.login(TOKEN);
        this.loadManagerEvent();
    }

    public loadManagerEvent() {
        this.on('ready', () => { this.manager.init(this.user?.id) });
        this.on('raw', (d: any) => { this.manager.updateVoiceState(d) });

        // Emitted whenever a node connects
        this.manager.on('nodeConnect', node => {
            console.log(`Node "${node.options.identifier}" connected.`);
        });

        // Emitted whenever a node reconnects
        this.manager.on('nodeReconnect', node => {
            console.log(`Node "${node.options.identifier}" reconnecting.`);
        });

        // Emitted whenever a node disconnects
        this.manager.on('nodeDisconnect', node => {
            console.log(`Node "${node.options.identifier}" disconnected.`);
        });

        // Emitted whenever a node encountered an error
        this.manager.on('nodeError', (node, error) => {
            console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`);
        });

        this.manager.on('playerCreate', async (player) => {
            setTimeout(async () => {
                player.setVolume(100);
                player.set('autoplay', false);
                player.set('24/7', false);
            }, 100);
        });

        this.manager.on('playerMove', async (player, _oldChannel = '', newChannel = '') => {
            if (!newChannel) {
                const playchannel = this.channels.cache.get(player.textChannel as string) as TextChannel;
                playchannel?.send('Queue has ended. I left the channel');
                try {
                    if (player.get('msgid')) {
                        const oldChannel = this.channels.cache.get(player.textChannel as string) as TextChannel;
                        const oldMessage = await oldChannel.messages.fetch(player.get('msgid'));
                        setTimeout(async () => {
                            await oldMessage.delete();
                        }, 1500);
                    }
                }
                catch (err) {
                    console.error(err);
                }
                player.destroy();
            }
            else {
                player.voiceChannel = newChannel;
                if (player.paused) return;
                setTimeout(() => {
                    player.pause(true);
                    setTimeout(() => player.pause(false), this.ws.ping * 2);
                }, this.ws.ping * 2);
            }
        });

        this.manager.on('trackStart', async (player, track) => {
            const requester = track.requester as User;

            const guild = this.guilds.cache.get(player.guild) as Guild;
            player.set('votes', 0);
            for (const userid of guild.members.cache.map(member => member.user.id)) { player.set(`vote-${userid}`, false); }
            player.set('previoustrack', track);
            // Wait 500ms
            await this.delay(500);

            const channel = await guild.channels.fetch(player.textChannel as string) as TextChannel;
            const embed = new MessageEmbed()
                .setTitle('Music Player')
                .setDescription(`Playing: ${track.title}`)
                .setThumbnail(track.displayThumbnail("1"))
                .setColor('#ff0000')
                .addField('❯ Duration: ', `\`${track.isStream ? 'LIVE STREAM' : this.msToHHMMSS(track.duration)}\``, true)
                .addField('❯ Song By: ', `\`${track.author}\``, true)
                .addField('❯ Queue length: ', `\`${player.queue.length} Songs\``, true)
                .setFooter(`Requested by: <@${requester?.id}>`, requester?.displayAvatarURL({ dynamic: true }));

            // Send a message when not in manager music channel and the track starts playing with the track name
            if (player.get('msgid')) {
                const oldMsg = await channel.messages.fetch(player.get('msgid'));
                await this.delay(500);
                await oldMsg.delete().catch();
            }
            const sentMsg = await channel.send({ embeds: [embed] });
            player.set('msgid', sentMsg.id);

        });

        this.manager.on('trackError', (player, track) => {
            player.stop();
            (this.channels.cache.get(player.textChannel as string) as TextChannel)
                .send(`I skipped the track **${track.title}** because of error`);
        });

        // Emitted the player queue ends
        this.manager.on('queueEnd', async (player) => {

            const guild = this.guilds.cache.get(player.guild);
            if (player.get('autoplay')) return this.manager.autoplay(player);
            const noSongEmbed = new MessageEmbed()
                .setTitle('Music Player!')
                .setDescription('No playing song currently!\nJoin a voice channel and enter a song name or url to play.')
                .setColor('#ff0000')
                .setFooter('Requested by: None');

            const channel = (guild as Guild).channels.cache.get(player.textChannel as string) as TextChannel;
            if (player.get('msgid')) {
                const oldMsg = await channel.messages.fetch(player.get('msgid'));
                await this.delay(500);
                await oldMsg.delete().catch();
            }
            channel.send({ embeds: [noSongEmbed] });

        });

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
        manager: Player
    }
}

declare module 'discord.js' {
    interface Client {
        manager: Player
    }
}