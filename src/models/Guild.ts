import { Document, model, Schema } from 'mongoose';

import { PREFIX } from '#root/configs'

interface IGuild extends Document {
    guildID: string;
    prefix: string;
    whitelist: boolean;

}

const guildSchema = new Schema({
    guildID: { type: String, required: true, unique: true },
    prefix: { type: String, default: PREFIX },
    whitelist: { type: Boolean, default: false },
}, {
    versionKey: false
});

export default model<IGuild>('Guild', guildSchema)