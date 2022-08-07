import { Document, model, Schema } from "mongoose";
import { PREFIX } from "#root/configs";

export interface IUser extends Document {
    userID: string;
    prefix: string[];
    blacklist: boolean;
    playlist_limit: number;
    repeat_mode: boolean;
    volume: number;
}

const userSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    prefix: { type: Array<string>, default: [PREFIX] },
    blacklist: { type: Boolean, default: false },
    playlist_limit: { type: Number, default: 5 },
    repeat_mode: { type: Number, default: 0 },
    volume: { type: Number, default: 100 },
}, {
    versionKey: false,
    timestamps: true,
});

export default model<IUser>("User", userSchema);