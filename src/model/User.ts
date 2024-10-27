import mongoose, { Document, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Explicitly define _id
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationCode?: string;
    interests: string[]; // Change interests to an array of strings
    getJWTToken(): string; 
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: '' },
    verificationCode: { type: String, default: '' },
    interests: { type: [String], default: [] } // Change interests field to an array of strings
});

UserSchema.methods.getJWTToken = function (): string {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
    });
};

export default mongoose.model<IUser>('User', UserSchema);
