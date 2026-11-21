import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('MONGODB_CONNECTION_STRING is not defined in environment variables');
        }
        await mongoose.connect(connectionString, {});
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;