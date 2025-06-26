const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const spotifyRoutes = require('./routes/spotify');

// Gets our client secret and ID from the .env file
dotenv.config();

const app = express();
app.use(cors());
app.use('/spotify', spotifyRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});