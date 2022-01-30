import { Document, model, Schema } from "mongoose";
import { PREFIX } from "#root/configs";

export interface IUser extends Document {
    userID: string;
    prefix: string[];
    whitelist: boolean;
    blacklist: boolean;
    playlist_limit: number;
}

const userSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    prefix: { type: Array, required: true, default: [PREFIX] },
    whitelist: { type: Boolean, required: true, default: false },
    blacklist: { type: Boolean, required: true, default: false },
    playlist_limit: { type: Number, required: true, default: 5 },
}, {
    versionKey: false
});

export default model<IUser>("User", userSchema);