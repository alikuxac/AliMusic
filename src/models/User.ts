import { Document, model, Schema } from "mongoose";

export interface IUser extends Document {
    userID: string;
    username: string;
    whitelist: boolean;
    blacklist: boolean;
    playlist_limit: number;
}

const userSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    whitelist: { type: Boolean, required: true, default: false },
    blacklist: { type: Boolean, required: true, default: false },
    playlist_limit: { type: Number, required: true, default: 5 },
}, {
    versionKey: false
});

export default model<IUser>("User", userSchema);