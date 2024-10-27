import { Request, Response, RequestHandler } from 'express';
import User from '../model/User';

export const addInterests: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    const { userId, interests } = req.body;

    try {
        // Ensure `interests` is an array of strings
        const formattedInterests: string[] = Array.isArray(interests) ? interests : [];

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { interests: formattedInterests } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Interests updated successfully", user });
    } catch (error) {
        console.error("Error adding interests:", error);
        res.status(500).json({ message: "Error adding interests", error });
    }
};


export const getInterests: RequestHandler = async (req: Request, res: Response): Promise<any> => {
    const { userId } = req.params; // Use params to retrieve userId from the request URL

    try {
        // Find the user by userId and select the interests field
        const user = await User.findById(userId).select('interests'); // Adjust the field name as per your model

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send back the interests to the client
        return res.status(200).json({ interests: user.interests });
    } catch (error:any) {
        console.error('Error fetching interests:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};