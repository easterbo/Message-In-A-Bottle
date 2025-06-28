const db = require('../db');
const axios = require('axios');

async function createUser(spotify_id, email, refresh_token) {
    const result = await db.query(
        `INSERT INTO users (spotify_id, email, refresh_token)
        VALUES ($1, $2, $3)
        ON CONFLICT (spotify_id)
        DO UPDATE SET
        refresh_token = EXCLUDED.refresh_token,
        email = EXCLUDED.email
        RETURNING spotify_id`,
        [spotify_id, email, refresh_token]
    );
}

module.exports = { createUser };


