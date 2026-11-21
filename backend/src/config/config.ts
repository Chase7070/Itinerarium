import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
    port: number;
    mongoDB_connection: string;
    jwt_secret: string;
    public_dir: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    mongoDB_connection: process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/journey_pin',
    jwt_secret: process.env.JWT_SECRET || 'your_jwt_secret',
    public_dir: path.resolve(process.cwd(), 'public'), // Use absolute path
};

export default config;