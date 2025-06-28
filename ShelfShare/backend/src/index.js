require('dotenv').config();
const express = require('express');
const cors = require('cors');

const spotifyRoutes = require('./routes/spotify');
const testRoutes = require('./routes/test');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/spotify', spotifyRoutes);
app.use('/test', testRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
