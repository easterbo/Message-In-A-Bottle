const express = require('express');
const axios = require('axios');
const qs = require('qs');
const { getValidAccessToken } = require('../utils/spotify_utils');
const { getUserTokens } = require('../utils/auth');
require('dotenv').config();

const router = express.Router();

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI
} = process.env;

// -------------- Login ---------------------------------------------------------------------------------------------
// Takes users to the Spotify Login and Authorisation Screen, then redirects to SPOTIFY_REDIRECT_URI (/callback)
router.get('/login', (req, res) => {
  const scope = 'user-library-read';
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}&scope=${encodeURIComponent(scope)}`;
  res.redirect(authUrl);
});

// Handles Spotify's redirect and exchanges it for an auth token. Returns access and refresh token.
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token } = response.data;

    // TODO: Store above values in DB alongside a userID.
    // Access tokens expire quickly, Refresh do not.
    // We need to store the encrypted refresh tokens in a database.
    // We can use these to generate a new access token.
    // This stops the user from having to log in every time.

    res.json({ access_token, refresh_token });
  } 
  catch (err) { res.status(400).json({ error: 'Token exchange failed' }); }
});



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
