import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import connectDatabase from './config/db';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';


dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests only from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));


connectDatabase();
// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
