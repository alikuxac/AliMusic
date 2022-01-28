import { Document, model, Schema } from 'mongoose';
import type { Song } from 'distube';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

export interface IPlaylist extends Document {
    userID: string;
    name: string;
    songs: Array<Song>;
    createdAt: number;
    updatedAt: number;
}

const playlistSchema = new Schema({
    id: { type: String, unique: true, default: () => nanoid() },
    userID: { type: String, required: true },
    name: { type: String, required: true },
    songs: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default model<IPlaylist>('Playlist', playlistSchema);