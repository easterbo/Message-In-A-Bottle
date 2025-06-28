const express = require('express');
const db = require('../db');
const router = express.Router();

// WORKING!!!!!
router.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ dbTime: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: 'DB connection failed', detail: err.message });
  }
});

module.exports = router;
