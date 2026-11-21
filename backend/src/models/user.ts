import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    avatar: string;
}

const UserSchema: Schema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
    },
    {
        timestamps: true, // Automatically manage `created_at` and `updated_at`
    }
);

UserSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.password; // Exclude password from the response
        return ret;
    },
});

export const User = mongoose.model<IUser>('User', UserSchema);