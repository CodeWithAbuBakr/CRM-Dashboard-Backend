import Client from '../models/client.js';

// Create a new client
const createClient = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Basic validation
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    const client = new Client({ name, email });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      return res.status(409).json({ message: 'Client with this email already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createClient,
  getClients,
  deleteClient,
};
