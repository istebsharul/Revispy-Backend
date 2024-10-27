import { Response } from 'express';
import { IUser } from '../model/User'; // Import IUser if you defined it as an interface
import dotenv from 'dotenv';

dotenv.config();

/**
 * Sends authentication token in a cookie and user data in the response.
 * @param {IUser} user - The authenticated user.
 * @param {number} statusCode - The HTTP status code to be sent in the response.
 * @param {Response} res - The Express response object.
 */
const sendToken = (user: IUser, statusCode: number, res: Response): void => {
    const token = user.getJWTToken(); // Generate the JWT token
    console.log("Expiry....",process.env.EXPIRE_COOKIE);
    // The options object contains settings for the cookie.
    const options = {
        expires: new Date(Date.now() + Number(process.env.EXPIRE_COOKIE) * 24 * 60 * 60 * 1000), // converting to milliseconds
        httpOnly: true, // Helps to prevent XSS attacks
    };

    // Create a response object without the password
    const userResponse = user.toObject(); // Convert the user instance to a plain object
    userResponse.password = undefined; // Explicitly set password to undefined
    userResponse.verificationCode = undefined;
    userResponse.verificationToken = undefined;

    // Set the cookie and send the response
    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            user: userResponse,
            token,
        });
};

export default sendToken;
