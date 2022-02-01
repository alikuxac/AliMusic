import { Document, model, Schema } from 'mongoose';

interface IGuild extends Document {
    guildID: string;
    whitelist: boolean;

}

const guildSchema = new Schema({
    guildID: { type: String, required: true, unique: true },
    whitelist: { type: Boolean, default: false },
}, {
    versionKey: false
});

export default model<IGuild>('Guild', guildSchema)