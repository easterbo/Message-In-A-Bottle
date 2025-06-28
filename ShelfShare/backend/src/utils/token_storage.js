// Gets the user's tokens from the DB using their userID.
// Example Use: const { accessToken, refreshToken } = await getUserTokens(userId);
async function getUserTokens(userId) {
    // TODO: Retrieve refresh_token from our database.
}

// Updates user's access Token with the new token.
async function updateUserAccessToken(userId, newAccessToken) {
    // TODO: Update user's access token
}

// Updates user's access Token with the new token.
async function updateUserRefreshToken(userId, newRefreshToken) {
    // TODO: Update user's refresh token
}

module.exports = {
    getUserTokens,
    updateUserAccessToken,
    updateUserRefreshToken
};
