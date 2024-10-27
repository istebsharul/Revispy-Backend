import jwt from 'jsonwebtoken';

// Function to sign a token
export const signToken = (payload: object, options?: jwt.SignOptions): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

// Function to verify a token
export const verifyToken = (token: string): object | string => {
    return jwt.verify(token, process.env.JWT_SECRET as string);
};
