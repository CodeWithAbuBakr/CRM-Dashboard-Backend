import EmailModel from "../models/Email.js";

    async function savedEmails (req, res) {
    try {
      const emails = req.body.emails;
  
      // Validate emails array
      if (!emails || emails.length === 0) {
        return res.status(400).json({ message: 'No emails provided' });
      }
  
      const savedEmails = [];
  
      // Iterate through each email and save only if it doesn't already exist
      for (const email of emails) {
        // Check if the email already exists based on unique fields (from, subject, receivedDateTime)
        const existingEmail = await EmailModel.findOne({
          from: email.from,
          subject: email.subject,
          receivedDateTime: email.receivedDateTime,
        });
  
        if (!existingEmail) {
          // Email does not exist, save it
          const newEmail = new EmailModel(email);
          const savedEmail = await newEmail.save();
          savedEmails.push(savedEmail);
        }
      }
  
      if (savedEmails.length === 0) {
        return res.status(200).json({ message: 'No new emails to save' });
      }
  
      res.status(201).json({ message: 'Emails saved successfully', savedEmails });
    } catch (error) {
      console.error('Error saving emails:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  

  export default savedEmails;