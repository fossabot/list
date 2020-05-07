import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: 'User must have an email',
    },
    googleID: {
        type: String,
        // Note: we can relax that requirement if we start
        // supporting more identity platforms.
        required: 'User must be logged-in with Google',
    },
});

type UserDocument = mongoose.Document & {
    googleID: string;
    name: string;
    email: string;
};

export const User = mongoose.model<UserDocument>('User', userSchema);