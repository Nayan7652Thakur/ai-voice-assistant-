import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent model recompilation error in Next.js development mode
export const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
