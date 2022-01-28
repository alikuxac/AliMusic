import { Document, Schema, model } from 'mongoose';

interface IBot extends Document {
    id: String;
    whitelist_server: Array<string>;
}

const botSchema = new Schema({
    id: { type: String, required: true, unique: true },
    whitelist_server: { type: Array, default: [] },
});

export default model<IBot>('Bot', botSchema);