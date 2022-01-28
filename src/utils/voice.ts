import { container } from "@sapphire/pieces";
import type { GuildIdResolvable, Queue } from "distube";

export function getAudio(guild: GuildIdResolvable) {
    return <Queue>container.distube.getQueue(guild);
}

export function AudioExists(guild: GuildIdResolvable) {
    return container.distube.getQueue(guild) !== undefined;
}
