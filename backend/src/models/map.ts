import mongoose, { Schema, Document } from 'mongoose';
import { IShare } from './share';

/**
 * @interface IMap
 * Represents a map document in the database.
 */
export interface IMap extends Document {
    /**
     * The name of the map.
     */
    name: string;

    /**
     * The type of the map (e.g., private, public).
     */
    type: 'default' | 'shareable';

    /**
     * A description of the map.
     */
    description: string;

    /**
     * The ID of the owner of the map.
     * This field references the `User` model.
     */
    owner: mongoose.Types.ObjectId;


    /**
     * A list of collaborators for the map.
     * 
     * This field stores the IDs of users who have been added as collaborators to the map.
     * Collaborators can access and edit the map based on the permissions granted.
     * 
     * - Type: Array of ObjectIds referencing the `User` model.
     * - Default: An empty array (no collaborators by default).
     */
    collaborators: mongoose.Types.ObjectId[]; // Use array for collaborators


    share?: IShare;

    /**
     * The date and time when the map was created.
     */
    created_at: Date;

    /**
     * The date and time when the map was last updated.
     */
    updated_at: Date;
}

/**
 * @schema MapSchema
 * Defines the schema for the `Map` model.
 */
const MapSchema: Schema = new Schema(
    {
        /**
         * The name of the map.
         * This field is required.
         */
        name: { type: String, required: true },

        /**
         * The type of the map (e.g., private, public).
         * This field is required and must be one of the specified enum values.
         */
        type: {
            type: String,
            required: true,
            enum: ['default', 'shareable'], // Enum validation
            default: 'shareable', // Set default value to 'shareable'
        },

        /**
         * A description of the map.
         * This field is optional.
         */
        description: { type: String, required: false },

        /**
         * The ID of the owner of the map.
         * This field references the `User` model and is required.
         */
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

        /**
         * A list of collaborators for the map.
         * 
         * This field stores the IDs of users who have been added as collaborators to the map.
         * Collaborators can access and edit the map based on the permissions granted.
         * 
         * - Type: Array of ObjectIds referencing the `User` model.
         * - Default: An empty array (no collaborators by default).
         */
        collaborators: {
            type: [mongoose.Schema.Types.ObjectId], // Store as an array in MongoDB
            ref: 'User',
            default: [], // Default to an empty array
        },
    },
    {
        /**
         * Automatically manage `created_at` and `updated_at` fields.
         */
        timestamps: true,
    }
);

// Define a virtual field for `share`
MapSchema.virtual('share', {
    ref: 'Share', // The model to populate
    localField: '_id', // The field in `Map` that matches `foreignField` in `Share`
    foreignField: 'target_id', // The field in `Share` that references `Map`
    justOne: true, // Each map has only one share
});

MapSchema.set('toJSON', {
    virtuals: true, // Include virtual fields
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

/**
 * @model Map
 * Represents the `Map` model in the database.
 */
export default mongoose.model<IMap>('Map', MapSchema);