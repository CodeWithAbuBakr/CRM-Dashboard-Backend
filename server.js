import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import DbCon from './utlis/db.js'; // Fixed typo from 'utlis' to 'utils'
import AuthRoutes from './routes/Auth.js';
import AdminRoutes from './routes/AdminRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import msLoginRouter from './routes/login.route.js';
import EmailsRoute from './routes/Email.Route.js';

dotenv.config();

const PORT = process.env.PORT || 4000; // Fallback port

const app = express();

// MongoDB connection
DbCon();

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [
        'http://localhost:5173',
        'http://192.168.1.5:5173',
        'https://crm-dashboard-frontend-pi.vercel.app'
    ]
}));
app.options('*', cors());


// Define routes
app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/emails', EmailsRoute);
app.use("/api/login", msLoginRouter);

app.get('/', (req, res) => {
    res.send('Your backend is working');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
