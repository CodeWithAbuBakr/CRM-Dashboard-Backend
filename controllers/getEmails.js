import EmailModel from "../models/Email.js";

async function getEmails(req, res) {
    try {
        const emails = await EmailModel.find();  // Fetch all emails from MongoDB
        res.status(200).json(emails);
    } catch (error) {
        console.error('Error fetching emails:', error);
        res.status(500).json({ message: 'Failed to fetch emails' });
    }
}

export default getEmails;