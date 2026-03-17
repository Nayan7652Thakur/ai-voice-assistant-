import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage {
    role: string;
    content: string;
}

export interface IChat extends Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    messages: IMessage[];
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        role: { type: String, required: true },
        content: { type: String, required: true },
    },
    { _id: false }
);

const ChatSchema: Schema<IChat> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            default: "New Chat",
        },
        messages: [MessageSchema],
    },
    {
        timestamps: true,
    }
);

export const Chat: Model<IChat> =
    mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
