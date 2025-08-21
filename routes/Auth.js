import express from 'express'
import { CheckUser, Login, Logout, register } from '../controllers/Auth.js'
import {IsUser} from '../middleware/verifyToken.js'
const AuthRoutes=express.Router()

AuthRoutes.post('/register',register)
AuthRoutes.post('/login',Login)
AuthRoutes.post('/logout',Logout)
AuthRoutes.get('/checkuser',IsUser,CheckUser)
AuthRoutes.post('/clear-token', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Token cleared successfully' });
});

// Route to reset authentication state
AuthRoutes.post('/reset-auth', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Authentication reset successfully. Please log in again.' });
});

export default AuthRoutes