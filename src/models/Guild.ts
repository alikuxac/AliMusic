import { Document, model, Schema } from 'mongoose';

import { PREFIX } from '#root/configs'

interface IGuild extends Document {
    id: string;
    prefix: string;
    whitelist: boolean;

}

const guildSchema = new Schema({
    id: { type: String, required: true, unique: true },
    prefix: { type: String, default: PREFIX },
    whitelist: { type: Boolean, default: false },
})

export default model<IGuild>('Guild', guildSchema)