import { createFunctionPrecondition } from "@sapphire/decorators";
import type { Message } from "discord.js";
import { getAudio, AudioExists } from "#utils/voice";

export function PlayerExists(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => AudioExists(message.guild!),
        (message: Message) => {
            message.channel.send(`There is no player for this guild.`);
        }
    );
}

export function RequiredUserInVoice(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => message.member?.voice.channel !== null,
        (message: Message) => {
            message.channel.send('You have to be in a voice channel to use this command!');
        }
    )
}

export function RequiredBotInVoice(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) =>  getAudio(message.guild!).voiceChannel?.id !== null,
        (message: Message) => {
            message.channel.send('I have to be in a voice channel to use this command!');
        }
    )
}

export function RequireSameVoiceChannel(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => message.member?.voice.channelId === getAudio(message.guild!).voiceChannel?.id,
        (message: Message) => {
            message.channel.send('You have to be in the same voice channel as me to use this command!');
        }
    )
}

export function RequiredMusicPlaying(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => getAudio(message.guild!).playing,
        (message: Message) => {
            message.channel.send('You have to be in a voice channel and playing music to use this command!');
        }
    )
}

export function RequiredMusicPaused(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => getAudio(message.guild!)?.paused,
        (message: Message) => {
            message.channel.send('You have to be in a voice channel and paused music to use this command!');
        }
    )
}

export function RequireQueueNotEmpty(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => getAudio(message.guild!).songs.length > 0,
        (message: Message) => {
            message.channel.send('You have to be in a voice channel and have music in the queue to use this command!');
        }
    )
}

export function RequireSongPresent(): MethodDecorator {
    return createFunctionPrecondition(
        (message: Message) => getAudio(message.guild!).currentTime !== undefined,
        (message: Message) => {
            message.channel.send('You have to be in a voice channel and have a song in the queue to use this command!');
        }
    )
}