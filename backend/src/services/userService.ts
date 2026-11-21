import { User } from '@/models/user';
import bcrypt from 'bcrypt';

export const createUser = async (data: { email: string; username: string; password: string; avatar: string }) => {
    if (data.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
    }

    // Create the user
    const newUser = new User(data);
    return await newUser.save();
};

/**
 * Find a user by email
 * @param email - The email of the user to find
 * @returns The user document or null if not found
 */
export const findUserByEmail = async (email: string) => {
    return await User.findOne({ email });
};

export const updateUser = async (userId: string, data: Partial<{ username: string; password: string; avatar: string }>) => {
    if (data.password) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
    }
    return await User.findByIdAndUpdate(userId, data, { new: true });
};