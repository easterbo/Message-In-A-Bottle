const express = require('express');
const axios = require('axios');
const qs = require('qs');
const { createUser } = require('../models/user_model');

const { getValidAccessToken } = require('../utils/spotify_utils');
const { getUserTokens } = require('../utils/token_storage');
require('dotenv').config();

const router = express.Router();

const {
  SPOTIFY_CLIENT_ID,
} = process.env;

// Handles frontend/auth.js redirect and exchanges auth code for access and refresh token.
router.post('/callback', async (req, res) => {
  // DEBUGGING - verify that code, code_verifier and redirect_uri exist and match.
  console.log(req.body)

  // Frontend sends code, code verifier and the redirect URI.
  const { code, code_verifier, redirect_uri } = req.body;

  if (!code || !code_verifier) {
    return res.status(400).json({ error: 'Missing code or code_verifier' });
  }

  // Try to generate tokens using the code and code_verifier, ensuring we return to redirect_uri.
  try {
    const tokenResponse = await axios.post(
      'https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri,
        client_id: SPOTIFY_CLIENT_ID,
        code_verifier
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    // Get tokens.
    const { access_token, refresh_token } = tokenResponse.data;

    const profileResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Store tokens alongside spotifyID and email in DB, then return.
    const { id: spotify_id, email } = profileResponse.data;
    await createUser(spotify_id, email, refresh_token);
    res.status(200).json({ spotify_id: spotify_id, email: email, access_token: access_token, refresh_token: refresh_token });
  }
  catch (err) {
    console.error('Spotify callback error:', err.response?.data || err.message);
    res.status(400).json({ error: 'Token exchange failed' });
  }
});


// IGNORE BELOW FOR NOW.
// -------------- Functionality ------------------------------------------------------------------------------------
// Attempts to access a user's library.
router.get('/library', async (req, res) => {
  const token = req.headers.authorization;
  try {
    const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  }
  catch (err) { res.status(401).json({ error: 'Unauthorized' }); }
});

// Attempts to search a user's library.
router.get('/search', async (req, res) => {
  const token = req.headers.authorization;
  const query = req.query.q;
  try {
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { q: query, type: 'track,artist,album', limit: 10 }
    });
    res.json(response.data);
  }
  catch (err) { res.status(400).json({ error: 'Search failed' }); }
});

module.exports = router;

// TODO: Update route handlers to use verification.
// To update route handlers to use verification...
// 1. get UserID and/or query from req.
// 2. try {const token = await getValidAccessToken(userId);}
// 3. Use token to authorise library and search API calls.