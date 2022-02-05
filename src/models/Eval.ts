import { Document, model, Schema } from "mongoose";
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 4);

export interface IEval extends Document {
    guildID: string;
    code: string;
}

const evalSchema = new Schema({
    id: { type: String, unique: true, default: () => nanoid() },
    guildID: { type: String, required: true },
    code: {type: String, required: true}
}, {
    versionKey: false,
    timestamps: true
}) 

export default model<IEval>('Eval', evalSchema)