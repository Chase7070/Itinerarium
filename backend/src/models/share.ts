import mongoose, { Schema, Document } from 'mongoose';
import { IMap } from './map';

export interface IShare extends Document {
    scene: 'map';
    code: string;
    map: IMap;
    target_id: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    access: {
        range: 'anyone' | 'private' | 'assigned';
        relevant_ids?: {
            id: string; // User ID
            permission: 'read' | 'write';
        }[];
    };
}

const ShareSchema: Schema = new Schema(
    {
        scene: {
            type: String,
            enum: ['map'], // Enum with a single value for now
            required: true,
        },
        map: { type: mongoose.Schema.Types.Mixed, ref: 'Map', default: null },
        code: { type: String, required: true },
        target_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // No fixed ref
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
        access: {
            range: {
                type: String,
                enum: ['private', 'anyone', 'assigned'],
                required: true,
            },
            relevant_ids: {
                type: [
                    {
                        id: { type: String, required: true },
                        permission: { type: String, enum: ['read', 'write'], required: true },
                        user: { type: mongoose.Schema.Types.Mixed, default: null },
                    },
                ]
            },
        },
    },
    {
        timestamps: true, // Automatically adds created_at and updated_at fields
    }
);

// Create a compound index to ensure (scene, code, target_id) is unique
ShareSchema.index({ scene: 1, code: 1, target_id: 1 }, { unique: true });

ShareSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<IShare>('Share', ShareSchema);