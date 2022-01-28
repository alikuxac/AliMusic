import { createFunctionPrecondition } from "@sapphire/decorators";
import type { GuildMessage } from "#lib/types";
import { getAudio, AudioExists } from "#utils/voice";

export function PlayerExists(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => AudioExists(message.guild),
        (message: GuildMessage) => {
            message.channel.send(`There is no player for this guild.`);
        }
    );
}

export function RequiredUserInVoice(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channel !== null,
        (message: GuildMessage) => {
            message.channel.send('You have to be in a voice channel to use this command!');
        }
    )
}

export function RequiredBotInVoice(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.guild.me?.voice.channel !== null,
        (message: GuildMessage) => {
            message.channel.send('I have to be in a voice channel to use this command!');
        }
    )
}

export function RequireSameVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => message.member.voice.channelId === getAudio(message.guild).voiceChannel?.id,
        (message: GuildMessage) => {
            message.channel.send('You have to be in the same voice channel as me to use this command!');
        }
    )
}

export function RequiredMusicPlaying(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).playing,
        (message: GuildMessage) => {
            message.channel.send('You have to be in a voice channel and playing music to use this command!');
        }
    )
}

export function RequiredMusicPaused(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild)?.paused,
        (message: GuildMessage) => {
            message.channel.send('You have to be in a voice channel and paused music to use this command!');
        }
    )
}

export function RequireQueueNotEmpty(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).songs.length > 0,
        (message: GuildMessage) => {
            message.channel.send('You have to be in a voice channel and have music in the queue to use this command!');
        }
    )
}

export function RequireSongPresent(): MethodDecorator {
    return createFunctionPrecondition(
        (message: GuildMessage) => getAudio(message.guild).currentTime !== undefined,
        (message: GuildMessage) => {
            message.channel.send('You have to be in a voice channel and have a song in the queue to use this command!');
        }
    )
}