const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();


const connectDB = require('./config/db');
const watchlistRoutes = require('./routes/watchlistRoutes');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());


connectDB();


app.use(watchlistRoutes);

app.get('/', (req, res) => {
  res.send('Crypto Tracker API is running');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});