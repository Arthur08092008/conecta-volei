const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const timeRoutes = require('./routes/timeRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/times', timeRoutes);

module.exports = app;