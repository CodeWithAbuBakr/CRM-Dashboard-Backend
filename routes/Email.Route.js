import express from 'express';
import savedEmails from '../controllers/saveEmails.js';
import getEmails from '../controllers/getEmails.js';
import deletedEmail from '../controllers/deleteEmail.js';

const EmailsRoute = express.Router();

EmailsRoute.post('/saveEmails', savedEmails);
EmailsRoute.get('/getEmails', getEmails);
EmailsRoute.delete('/deleteEmail/:emailId', deletedEmail);

export default EmailsRoute;
