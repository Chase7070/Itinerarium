import mongoose, { Schema, Document } from 'mongoose';

/**
 * @interface IJourneyAlbum
 * Represents a journey album document in the database.
 */
export interface IJourneyAlbum extends Document {
    /**
     * The name of the journey album.
     * This field is required.
     */
    name: string;

    /**
     * An array of images associated with the journey album.
     * Each image contains a `key` field.
     */
    images: { key: string }[];

    /**
     * The ID of the associated map pin.
     * This field references the `MapPin` model.
     */
    map_pin_id: mongoose.Types.ObjectId;

    /**
     * The ID of the associated map.
     * This field references the `Map` model.
     */
    map_id: mongoose.Types.ObjectId;

    /**
     * The ID of the user who created the journey album.
     * This field references the `User` model.
     */
    user_id: mongoose.Types.ObjectId;
}

/**
 * @schema JourneyAlbumSchema
 * Defines the schema for the `JourneyAlbum` model.
 */
const JourneyAlbumSchema: Schema = new Schema(
    {
        /**
         * The name of the journey album.
         * This field is required.
         */
        name: { type: String, required: true },

        /**
         * An array of images associated with the journey album.
         * Each image contains a `key` field.
         */
        images: [
            {
                key: { type: String, required: true },
                _id: false, // Disable _id for images
            },
        ],

        /**
         * The ID of the associated map pin.
         * This field references the `MapPin` model and is required.
         */
        map_pin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MapPin', required: true },

        /**
         * The ID of the associated map.
         * This field references the `Map` model and is required.
         */
        map_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Map', required: true },

        /**
         * The ID of the user who created the journey album.
         * This field references the `User` model and is required.
         */
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        /**
         * Automatically manage `created_at` and `updated_at` fields.
         */
        timestamps: true,
    }
);

JourneyAlbumSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

/**
 * @model JourneyAlbum
 * Represents the `JourneyAlbum` model in the database.
 */
export default mongoose.model<IJourneyAlbum>('JourneyAlbum', JourneyAlbumSchema);