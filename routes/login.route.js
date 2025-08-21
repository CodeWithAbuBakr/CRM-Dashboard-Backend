import express from 'express'
import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();

const msLoginRouter = express.Router();
const MICROSOFT_AUTH_URL = "https://login.microsoftonline.com/common/oauth2/v2.0/token";

// Client credentials (store securely in environment variables)
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI; // Must match the one registered in Azure AD

// Route to handle SSO login and token exchange
// msLoginRouter.post('/auth/microsoft', async (req, res) => {
//   const { auth_code } = req.body;
//   if (!auth_code) {
//     return res.status(400).json({ msg: 'Authorization code is missing' });
//   }

//   try {
//     const response = await axios.post(MICROSOFT_AUTH_URL, new URLSearchParams({
//       grant_type: 'authorization_code',
//       code: auth_code,
//       redirect_uri: REDIRECT_URI,
//       client_id: CLIENT_ID,
//       client_secret: CLIENT_SECRET,
//       scope: 'user.read mail.send Mail.ReadBasic Mail.Read Mail.ReadWrite offline_access'
//     }), {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       }
//     });

//     const tokens = response.data;
//     const access_token = tokens.access_token;
//     const refresh_token = tokens.refresh_token || null;

//     // Calculate expiration date
//     const expiration_date = new Date(Date.now() + 3600000).toISOString();

//     return res.status(200).json({
//       access_token,
//       refresh_token,
//       access_token_expiration: expiration_date
//     });
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     return res.status(error.response?.status || 500).json({
//       msg: 'Failed to exchange authorization code',
//       details: error.response?.data || error.message
//     });
//   }
// });

msLoginRouter.post('/auth/microsoft', async (req, res) => {
  const { auth_code, code_verifier } = req.body;
  if (!auth_code || !code_verifier) {
    return res.status(400).json({ msg: 'Authorization code or code_verifier is missing' });
  }

  try {
    const response = await axios.post(MICROSOFT_AUTH_URL, new URLSearchParams({
      grant_type: 'authorization_code',
      code: auth_code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      // client_secret: CLIENT_SECRET, // REMOVE for PKCE/public clients
      code_verifier: code_verifier,
      scope: 'user.read mail.send Mail.ReadBasic Mail.Read Mail.ReadWrite offline_access'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokens = response.data;
    const access_token = tokens.access_token;
    const refresh_token = tokens.refresh_token || null;
    const expiration_date = new Date(Date.now() + 3600000).toISOString();

    return res.status(200).json({
      access_token,
      refresh_token,
      access_token_expiration: expiration_date
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(error.response?.status || 500).json({
      msg: 'Failed to exchange authorization code',
      details: error.response?.data || error.message
    });
  }
});

// Route to handle token refresh
msLoginRouter.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ msg: 'Refresh token is missing' });
  }

  try {
    const response = await axios.post(MICROSOFT_AUTH_URL, new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: 'user.read mail.send Mail.ReadBasic Mail.Read Mail.ReadWrite offline_access'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const tokens = response.data;
    const expiration_date = new Date(Date.now() + 3600000).toISOString(); // Set expiration for 1 hour
    return res.status(200).json({ 
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      access_token_expiration: expiration_date
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return res.status(error.response?.status || 500).json({
      msg: 'Failed to refresh token',
      details: error.response?.data || error.message
    });
  }
});

export default msLoginRouter;
