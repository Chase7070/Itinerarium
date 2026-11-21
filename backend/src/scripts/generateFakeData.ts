import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import Map from '../models/map';
import MapPin from '../models/mapPin';
import JourneyAlbum from '../models/journeyAlbum';
import config from '../config/config';

const generateFakeData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.mongoDB_connection, {});
        console.log('Connected to MongoDB');

        // Clear existing data
        // await User.deleteMany({});
        // await Map.deleteMany({});
        // await MapPin.deleteMany({});
        // await JourneyAlbum.deleteMany({});
        // console.log('Cleared existing data');

        // Define city data
        const cities = [
            { name: 'Auckland', lat: -36.8485, lng: 174.7633 },
            { name: 'Wellington', lat: -41.2865, lng: 174.7762 },
            { name: 'Christchurch', lat: -43.5321, lng: 172.6362 },
        ];

        // Create users
        const users = [];
        for (let i = 1; i <= 5; i++) {
            const hashedPassword = await bcrypt.hash(`password${i}`, 10);
            const user = await User.create({
                email: `user${i}@example.com`,
                username: `user${i}`,
                password: hashedPassword,
            });

            // Create a default map for each user
            const defaultMap = await Map.create({
                name: `${user.username}'s Default Map`,
                type: 'default',
                description: 'This is the default map.',
                owner: user._id,
            });

            console.log(`Created user ${user.username} with default map: ${defaultMap.name}`);
            users.push({ user, defaultMap });
        }

        // Create map pins and journey albums for each user's default map
        for (const { user, defaultMap } of users) {
            const mapPins = [];
            for (const city of cities) {
                const mapPin = await MapPin.create({
                    geo_location: {
                        lat: city.lat,
                        lng: city.lng,
                    },
                    country: 'New Zealand',
                    city: city.name,
                    user_id: user._id,
                    map_id: defaultMap._id,
                });

                console.log(`Created map pin for ${city.name} for user ${user.username}`);
                mapPins.push(mapPin);
            }

            // Create journey albums for each map pin
            for (const mapPin of mapPins) {
                const journeyAlbum = await JourneyAlbum.create({
                    visited_date: new Date(),
                    images: [
                        { key: '/uploads/test/test.png' },
                        { key: '/uploads/test/test.png' },
                    ],
                    map_pin_id: mapPin._id,
                    user_id: user._id,
                });

                console.log(`Created journey album for map pin ${mapPin.city} of user ${user.username}`);
            }
        }

        console.log('Fake data generation completed');
    } catch (error) {
        console.error('Error generating fake data:', error);
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

generateFakeData();