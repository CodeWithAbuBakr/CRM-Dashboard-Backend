import EmailModel from "../models/Email.js";
async function deletedEmail (req, res) {
    const { emailId } = req.params;
    
    try {
      const deletedEmail = await EmailModel.findByIdAndDelete(emailId);
  
      if (!deletedEmail) {
        return res.status(404).json({ message: 'Email not found' });
      }
  
      res.status(200).json({ message: 'Email deleted successfully' });
    } catch (error) {
      console.error('Error deleting email:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  export default deletedEmail;