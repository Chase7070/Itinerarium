import mongoose, { Schema, Document } from 'mongoose';

export interface IMapPin extends Document {
    /**
     * The geographical location of the map pin.
     * `lat` and `lng` represent the latitude and longitude.
     */
    geo_location: { lat: number; lng: number };

    /**
     * The country where the map pin is located.
     */
    country: string;

    /**
     * The city where the map pin is located.
     */
    city: string;

    /**
     * The ID of the user who created the map pin.
     * This field references the `User` model and is required.
     * It is used to associate the map pin with a specific user.
     */
    user_id: string;

    /**
     * The ID of the map associated with this map pin.
     * This field references the `Map` model and is required.
     */
    map_id: string;
}

const MapPinSchema: Schema = new Schema(
    {
        geo_location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
        },
        country: { type: String, required: false },
        city: { type: String, required: false },
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        map_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Map', required: true },
    },
    {
        timestamps: true, // Automatically manage `created_at` and `updated_at`
    }
);

MapPinSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

export default mongoose.model<IMapPin>('MapPin', MapPinSchema);