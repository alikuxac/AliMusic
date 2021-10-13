import { Manager, ManagerOptions, Player } from 'erela.js';
import type AliMusicClient from '#lib/structures/AliMusicClient';

export default class PlayerManager extends Manager {

    public readonly client: AliMusicClient;
    // public readonly defaultEQ: defaultEQOptions[];
    // public readonly bassboost: any;
    // public readonly eqs: any;

    private readonly _defaultEQ1 = [
        { band: 0, gain: 0.15 },
        { band: 1, gain: 0.05 },
        { band: 2, gain: 0.025 },
        { band: 3, gain: 0 },
        { band: 4, gain: 0 },
        { band: 5, gain: -0.025 },
        { band: 6, gain: -0.05 },
        { band: 7, gain: -0.0175 },
        { band: 8, gain: 0 },
        { band: 9, gain: 0 },
        { band: 10, gain: 0.025 },
        { band: 11, gain: 0.05 },
        { band: 12, gain: 0.15 },
        { band: 13, gain: 0.25 },
        { band: 14, gain: 0.25 },
    ];

    private readonly _bassboost1 = {
        none: this.defaultEQ1,
        low: [
            { band: 0, gain: 0.125 },
            { band: 1, gain: 0.25 },
            { band: 2, gain: -0.25 },
            { band: 3, gain: -0.125 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.025 },
            { band: 6, gain: -0.05 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.025 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.15 },
            { band: 13, gain: 0.25 },
            { band: 14, gain: 0.25 },
        ],
        medium: [
            { band: 0, gain: 0.25 },
            { band: 1, gain: 0.5 },
            { band: 2, gain: -0.5 },
            { band: 3, gain: -0.25 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.025 },
            { band: 6, gain: -0.05 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.025 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.15 },
            { band: 13, gain: 0.25 },
            { band: 14, gain: 0.25 },
        ],
        high: [
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.75 },
            { band: 2, gain: -0.75 },
            { band: 3, gain: -0.375 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.025 },
            { band: 6, gain: -0.05 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.025 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.15 },
            { band: 13, gain: 0.25 },
            { band: 14, gain: 0.25 },
        ],
        earrape: [
            { band: 0, gain: 0.5 },
            { band: 1, gain: 1 },
            { band: 2, gain: -1 },
            { band: 3, gain: -0.5 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.025 },
            { band: 6, gain: -0.05 },
            { band: 7, gain: -0.0175 },
            { band: 8, gain: 0 },
            { band: 9, gain: 0 },
            { band: 10, gain: 0.025 },
            { band: 11, gain: 0.05 },
            { band: 12, gain: 0.15 },
            { band: 13, gain: 0.25 },
            { band: 14, gain: 0.25 },
        ],
    };

    private readonly _eqs1 = {
        music: this.defaultEQ1,
        pop: [
            { band: 0, gain: -0.200 },
            { band: 1, gain: -0.100 },
            { band: 2, gain: 0 },
            { band: 3, gain: 0.100 },
            { band: 4, gain: 0.150 },
            { band: 5, gain: 0.250 },
            { band: 6, gain: 0.300 },
            { band: 7, gain: 0.350 },
            { band: 8, gain: 0.300 },
            { band: 9, gain: 0.250 },
            { band: 10, gain: 0.150 },
            { band: 11, gain: 0.100 },
            { band: 12, gain: 0 },
            { band: 13, gain: -0.100 },
            { band: 14, gain: -0.200 },
        ],
        electronic: [
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.350 },
            { band: 2, gain: 0.125 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: -0.125 },
            { band: 6, gain: -0.125 },
            { band: 7, gain: 0 },
            { band: 8, gain: 0.25 },
            { band: 9, gain: 0.125 },
            { band: 10, gain: 0.15 },
            { band: 11, gain: 0.2 },
            { band: 12, gain: 0.250 },
            { band: 13, gain: 0.350 },
            { band: 14, gain: 0.400 },
        ],
        classical: [
            { band: 0, gain: 0.375 },
            { band: 1, gain: 0.350 },
            { band: 2, gain: 0.125 },
            { band: 3, gain: 0 },
            { band: 4, gain: 0 },
            { band: 5, gain: 0.125 },
            { band: 6, gain: 0.550 },
            { band: 7, gain: 0.050 },
            { band: 8, gain: 0.125 },
            { band: 9, gain: 0.250 },
            { band: 10, gain: 0.200 },
            { band: 11, gain: 0.250 },
            { band: 12, gain: 0.300 },
            { band: 13, gain: 0.250 },
            { band: 14, gain: 0.300 },
        ],
        rock: [
            { band: 0, gain: 0.300 },
            { band: 1, gain: 0.250 },
            { band: 2, gain: 0.200 },
            { band: 3, gain: 0.100 },
            { band: 4, gain: 0.050 },
            { band: 5, gain: -0.050 },
            { band: 6, gain: -0.150 },
            { band: 7, gain: -0.200 },
            { band: 8, gain: -0.100 },
            { band: 9, gain: -0.050 },
            { band: 10, gain: 0.050 },
            { band: 11, gain: 0.100 },
            { band: 12, gain: 0.200 },
            { band: 13, gain: 0.250 },
            { band: 14, gain: 0.300 },
        ],

        full: [
            { band: 0, gain: 0.25 + 0.375 },
            { band: 1, gain: 0.25 + 0.025 },
            { band: 2, gain: 0.25 + 0.0125 },
            { band: 3, gain: 0.25 + 0 },
            { band: 4, gain: 0.25 + 0 },
            { band: 5, gain: 0.25 + -0.0125 },
            { band: 6, gain: 0.25 + -0.025 },
            { band: 7, gain: 0.25 + -0.0175 },
            { band: 8, gain: 0.25 + 0 },
            { band: 9, gain: 0.25 + 0 },
            { band: 10, gain: 0.25 + 0.0125 },
            { band: 11, gain: 0.25 + 0.025 },
            { band: 12, gain: 0.25 + 0.375 },
            { band: 13, gain: 0.25 + 0.125 },
            { band: 14, gain: 0.25 + 0.125 },
        ],
        gaming: [
            { band: 0, gain: 0.350 },
            { band: 1, gain: 0.300 },
            { band: 2, gain: 0.250 },
            { band: 3, gain: 0.200 },
            { band: 4, gain: 0.150 },
            { band: 5, gain: 0.100 },
            { band: 6, gain: 0.050 },
            { band: 7, gain: -0.0 },
            { band: 8, gain: -0.050 },
            { band: 9, gain: -0.100 },
            { band: 10, gain: -0.150 },
            { band: 11, gain: -0.200 },
            { band: 12, gain: -0.250 },
            { band: 13, gain: -0.300 },
            { band: 14, gain: -0.350 },
        ],

        bassboost: this._bassboost1.medium,
        earrape: this._bassboost1.earrape
    };

    public constructor(options: ManagerOptions, client: AliMusicClient) {
        super(options);

        this.client = client;

        // this.defaultEQ = [
        //     { band: 0, gain: 0.15 },
        //     { band: 1, gain: 0.05 },
        //     { band: 2, gain: 0.025 },
        //     { band: 3, gain: 0 },
        //     { band: 4, gain: 0 },
        //     { band: 5, gain: -0.025 },
        //     { band: 6, gain: -0.05 },
        //     { band: 7, gain: -0.0175 },
        //     { band: 8, gain: 0 },
        //     { band: 9, gain: 0 },
        //     { band: 10, gain: 0.025 },
        //     { band: 11, gain: 0.05 },
        //     { band: 12, gain: 0.15 },
        //     { band: 13, gain: 0.25 },
        //     { band: 14, gain: 0.25 },
        // ];

        // this.bassboost = {
        //     none: this.defaultEQ,
        //     low: [
        //         { band: 0, gain: 0.125 },
        //         { band: 1, gain: 0.25 },
        //         { band: 2, gain: -0.25 },
        //         { band: 3, gain: -0.125 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: -0.025 },
        //         { band: 6, gain: -0.05 },
        //         { band: 7, gain: -0.0175 },
        //         { band: 8, gain: 0 },
        //         { band: 9, gain: 0 },
        //         { band: 10, gain: 0.025 },
        //         { band: 11, gain: 0.05 },
        //         { band: 12, gain: 0.15 },
        //         { band: 13, gain: 0.25 },
        //         { band: 14, gain: 0.25 },
        //     ],
        //     medium: [
        //         { band: 0, gain: 0.25 },
        //         { band: 1, gain: 0.5 },
        //         { band: 2, gain: -0.5 },
        //         { band: 3, gain: -0.25 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: -0.025 },
        //         { band: 6, gain: -0.05 },
        //         { band: 7, gain: -0.0175 },
        //         { band: 8, gain: 0 },
        //         { band: 9, gain: 0 },
        //         { band: 10, gain: 0.025 },
        //         { band: 11, gain: 0.05 },
        //         { band: 12, gain: 0.15 },
        //         { band: 13, gain: 0.25 },
        //         { band: 14, gain: 0.25 },
        //     ],
        //     high: [
        //         { band: 0, gain: 0.375 },
        //         { band: 1, gain: 0.75 },
        //         { band: 2, gain: -0.75 },
        //         { band: 3, gain: -0.375 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: -0.025 },
        //         { band: 6, gain: -0.05 },
        //         { band: 7, gain: -0.0175 },
        //         { band: 8, gain: 0 },
        //         { band: 9, gain: 0 },
        //         { band: 10, gain: 0.025 },
        //         { band: 11, gain: 0.05 },
        //         { band: 12, gain: 0.15 },
        //         { band: 13, gain: 0.25 },
        //         { band: 14, gain: 0.25 },
        //     ],
        //     earrape: [
        //         { band: 0, gain: 0.5 },
        //         { band: 1, gain: 1 },
        //         { band: 2, gain: -1 },
        //         { band: 3, gain: -0.5 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: -0.025 },
        //         { band: 6, gain: -0.05 },
        //         { band: 7, gain: -0.0175 },
        //         { band: 8, gain: 0 },
        //         { band: 9, gain: 0 },
        //         { band: 10, gain: 0.025 },
        //         { band: 11, gain: 0.05 },
        //         { band: 12, gain: 0.15 },
        //         { band: 13, gain: 0.25 },
        //         { band: 14, gain: 0.25 },
        //     ],
        // };

        // this.eqs = {
        //     music: this.defaultEQ,
        //     pop: [
        //         { band: 0, gain: -0.200 },
        //         { band: 1, gain: -0.100 },
        //         { band: 2, gain: 0 },
        //         { band: 3, gain: 0.100 },
        //         { band: 4, gain: 0.150 },
        //         { band: 5, gain: 0.250 },
        //         { band: 6, gain: 0.300 },
        //         { band: 7, gain: 0.350 },
        //         { band: 8, gain: 0.300 },
        //         { band: 9, gain: 0.250 },
        //         { band: 10, gain: 0.150 },
        //         { band: 11, gain: 0.100 },
        //         { band: 12, gain: 0 },
        //         { band: 13, gain: -0.100 },
        //         { band: 14, gain: -0.200 },
        //     ],
        //     electronic: [
        //         { band: 0, gain: 0.375 },
        //         { band: 1, gain: 0.350 },
        //         { band: 2, gain: 0.125 },
        //         { band: 3, gain: 0 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: -0.125 },
        //         { band: 6, gain: -0.125 },
        //         { band: 7, gain: 0 },
        //         { band: 8, gain: 0.25 },
        //         { band: 9, gain: 0.125 },
        //         { band: 10, gain: 0.15 },
        //         { band: 11, gain: 0.2 },
        //         { band: 12, gain: 0.250 },
        //         { band: 13, gain: 0.350 },
        //         { band: 14, gain: 0.400 },
        //     ],
        //     classical: [
        //         { band: 0, gain: 0.375 },
        //         { band: 1, gain: 0.350 },
        //         { band: 2, gain: 0.125 },
        //         { band: 3, gain: 0 },
        //         { band: 4, gain: 0 },
        //         { band: 5, gain: 0.125 },
        //         { band: 6, gain: 0.550 },
        //         { band: 7, gain: 0.050 },
        //         { band: 8, gain: 0.125 },
        //         { band: 9, gain: 0.250 },
        //         { band: 10, gain: 0.200 },
        //         { band: 11, gain: 0.250 },
        //         { band: 12, gain: 0.300 },
        //         { band: 13, gain: 0.250 },
        //         { band: 14, gain: 0.300 },
        //     ],
        //     rock: [
        //         { band: 0, gain: 0.300 },
        //         { band: 1, gain: 0.250 },
        //         { band: 2, gain: 0.200 },
        //         { band: 3, gain: 0.100 },
        //         { band: 4, gain: 0.050 },
        //         { band: 5, gain: -0.050 },
        //         { band: 6, gain: -0.150 },
        //         { band: 7, gain: -0.200 },
        //         { band: 8, gain: -0.100 },
        //         { band: 9, gain: -0.050 },
        //         { band: 10, gain: 0.050 },
        //         { band: 11, gain: 0.100 },
        //         { band: 12, gain: 0.200 },
        //         { band: 13, gain: 0.250 },
        //         { band: 14, gain: 0.300 },
        //     ],

        //     full: [
        //         { band: 0, gain: 0.25 + 0.375 },
        //         { band: 1, gain: 0.25 + 0.025 },
        //         { band: 2, gain: 0.25 + 0.0125 },
        //         { band: 3, gain: 0.25 + 0 },
        //         { band: 4, gain: 0.25 + 0 },
        //         { band: 5, gain: 0.25 + -0.0125 },
        //         { band: 6, gain: 0.25 + -0.025 },
        //         { band: 7, gain: 0.25 + -0.0175 },
        //         { band: 8, gain: 0.25 + 0 },
        //         { band: 9, gain: 0.25 + 0 },
        //         { band: 10, gain: 0.25 + 0.0125 },
        //         { band: 11, gain: 0.25 + 0.025 },
        //         { band: 12, gain: 0.25 + 0.375 },
        //         { band: 13, gain: 0.25 + 0.125 },
        //         { band: 14, gain: 0.25 + 0.125 },
        //     ],
        //     gaming: [
        //         { band: 0, gain: 0.350 },
        //         { band: 1, gain: 0.300 },
        //         { band: 2, gain: 0.250 },
        //         { band: 3, gain: 0.200 },
        //         { band: 4, gain: 0.150 },
        //         { band: 5, gain: 0.100 },
        //         { band: 6, gain: 0.050 },
        //         { band: 7, gain: -0.0 },
        //         { band: 8, gain: -0.050 },
        //         { band: 9, gain: -0.100 },
        //         { band: 10, gain: -0.150 },
        //         { band: 11, gain: -0.200 },
        //         { band: 12, gain: -0.250 },
        //         { band: 13, gain: -0.300 },
        //         { band: 14, gain: -0.350 },
        //     ],

        //     bassboost: this.bassboost.medium,
        //     earrape: this.bassboost.earrape
        // };


    }

    get defaultEQ1(){
        return this._defaultEQ1;
    }

    get bassboost1(){
        return this._bassboost1;
    }

    get eqs1(){
        return this._eqs1;
    }

    public format(millis: number) {
        const h = Math.floor(millis / 3600000),
            m = Math.floor(millis / 60000),
            s = ((millis % 60000) / 1000);
        if (h < 1) return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ' | ' + (Math.floor(millis / 1000)) + ' Seconds';
        else return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ' | ' + (Math.floor(millis / 1000)) + ' Seconds';
    }

    public async autoplay(player: Player) {
        if (player.queue.length > 0) return;
        const previoustrack: any = player.get('previoustrack');
        if (!previoustrack) return;


        const mixURL = `https://www.youtube.com/watch?v=${previoustrack.identifier}&list=RD${previoustrack.identifier}`;
        const response = await this.search(mixURL, previoustrack.requester);
        // if nothing is found, send error message, plus if there  is a delay for the empty QUEUE send error message TOO
        if (!response || response.loadType === 'LOAD_FAILED' || response.loadType !== 'PLAYLIST_LOADED') {
            return player.stop();
        }
        player.queue.add(response.tracks[Math.floor(Math.random() * Math.floor(response.tracks.length))]);
        return await player.play();
    }
}