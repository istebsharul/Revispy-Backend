import express from 'express';
import { registerHandler, loginHandler, verifyEmailHandler,logoutUser } from '../controllers/authController';
import { addInterests, getInterests } from '../controllers/interestController';


const router = express.Router();

// Register routes
router.post('/register', registerHandler);
router.post('/login', loginHandler);
router.post('/verify-email', verifyEmailHandler);
router.post('/logout', logoutUser);

// Route to add interests for a user
router.post('/add-interest', addInterests);
router.get('/get-interests/:userId', getInterests);

export default router;
