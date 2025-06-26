const axios = require('axios');
const qs = require('qs');
const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
} = process.env;

const {
  getUserTokens,
  updateUserAccessToken,
  updateUserRefreshToken
} = require('./auth');

// Returns valid access token related to UserID in DB.
async function getValidAccessToken(userId) {
  const tokens = await getUserTokens(userId);
  if (!tokens) { throw new Error('No tokens found for user'); }

  const { accessToken, refreshToken } = tokens;

  // Verify current access token works. If not expired, return.
  try {
    await axios.get('https://api.spotify.com/v1/me', { headers: { Authorization: `Bearer ${accessToken}` } });
    return accessToken;
  } 

  // If expired...
  catch (err) {
    if (err.response && err.response.status === 401) {
      // Refresh token.
      const refreshed = await refreshAccessToken(refreshToken);
      // Update access and refresh token (if changed).
      await updateUserAccessToken(userId, refreshed.accessToken);
      if (refreshed.refreshToken) { await updateUserRefreshToken(userId, refreshed.refreshToken); }
      return refreshed.accessToken;
    }
    else {
      console.error('Error checking Spotify access token:', err.message);
      throw new Error('Unable to verify or refresh access token');
    }
  }
}

// Refreshes user's access token using user's refresh token.
async function refreshAccessToken(refreshToken) {
  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  // Generate new access token using refresh token.
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    }), {
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in, refresh_token: newRefreshToken } = response.data;

    // Sometimes Spotify will not update the refreshToken. As such, we replace with null.
    return {
      accessToken: access_token,
      expiresIn: expires_in,
      refreshToken: newRefreshToken || null
    };

  }

  catch (error) {
    console.error('Failed to refresh Spotify access token:', error.response?.data || error.message);
    throw new Error('Token refresh failed');
  }
}

module.exports = {
  refreshAccessToken,
  getValidAccessToken
};
