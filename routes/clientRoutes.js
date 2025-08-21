import express from 'express';
import { createClient, getClients, deleteClient } from '../controllers/client.js';
import { isAdmin } from '../middleware/verifyToken.js';

const clientRouter = express.Router();

// Create a new client
clientRouter.post('/',isAdmin, createClient);

// Delete a client
clientRouter.delete('/:id',isAdmin, deleteClient);


// Get all clients
clientRouter.get('/', getClients);


export default clientRouter;
