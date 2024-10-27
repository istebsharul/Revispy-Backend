import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI: string | undefined = process.env.DB_URI;

const connectDatabase = async (): Promise<void> => {
  try {
    // Check if DB_URI is defined
    if (!DB_URI) {
      throw new Error('DB_URI environment variable is not defined');
    }

    // Connect to the database without additional options
    const connectInstance = await mongoose.connect(DB_URI);

    console.log(
      `Successfully connected to Database. Host: ${connectInstance.connection.host}`
    );
  } catch (error) {
    // Log the error with a proper message
    if (error instanceof Error) {
      console.error(`Database connection error: ${error.message}`);
    } else {
      console.error('An unknown error occurred while connecting to the database');
    }
  }
};

export default connectDatabase;
