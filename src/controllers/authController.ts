import express, { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../model/User';
import nodemailer from '../utils/nodemailer';
import { signToken } from '../utils/jwtUtils';
import sendToken from '../utils/sendToken';
import { IUser } from '../model/User';

const generateVerificationCode = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Register handler
export const registerHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = signToken({ email }, { expiresIn: '1h' });
    const verificationCode = generateVerificationCode();
    
    const newUser: IUser = new User({ name, email, password: hashedPassword, verificationToken, verificationCode });

    try {
        const savedUser = await newUser.save();
        const id = newUser._id.toString();

        // Send verification email
        await nodemailer.sendVerificationEmail(savedUser.email, id, verificationToken, verificationCode);
        
        // Send token to the user (optional, depending on your flow)
        sendToken(savedUser, 201, res);
        
        console.log('User registered successfully:', savedUser); // Success log
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error during registration:', error.message); // Error log
            res.status(500).json({ error: error.message });
        } else {
            console.error('Unknown error during registration'); // Error log
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

// Login handler
export const loginHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.warn('Login attempt with non-existent email:', email); // Warning log
            res.status(400).json({ message: 'User not found' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn('Invalid login attempt for email:', email); // Warning log
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        if (!user.isVerified) {
            console.warn('User not verified:', email); // Warning log
            res.status(403).json({ message: 'Please verify your email before logging in.' });
            return;
        }

        // Send the token to the user
        sendToken(user, 200, res);
        console.log('User logged in successfully:', user); // Success log
    } catch (error: unknown) {
        console.error('Error during login:', error instanceof Error ? error.message : 'Unknown error'); // Error log
        res.status(500).json({ error: 'An unknown error occurred' });
    }
};

// Email verification handler
export const verifyEmailHandler: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id, token, code } = req.body;

    try {
        const user = await User.findById(id);

        if (!user || user.isVerified) {
            console.warn('Invalid or already verified token for user:', id); // Warning log
            res.status(400).json({ message: 'Invalid or already verified token' });
            return;
        }

        // Update user's verification status
        if (user.verificationCode === code) {
            user.isVerified = true;
            user.verificationCode = undefined;
            await user.save();
            res.status(200).json({ message: 'Email verified successfully' });
            console.log('Email verified successfully for user:', user); // Success log
        } else {
            console.warn('Verification code mismatch for user:', id); // Warning log
            res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (error) {
        console.error('Error during email verification:', error instanceof Error ? error.message : 'Unknown error'); // Error log
        res.status(500).json({ message: 'An unknown error occurred' });
    }
};

export const logoutUser: RequestHandler = (async (req: Request, res: Response) => {
    // Clear the token cookie
    res.cookie('token', null, {
        expires: new Date(Date.now()), // Set expiration to the past to clear the cookie
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    });

    // Send success response
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});