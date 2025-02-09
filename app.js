const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose')
const dotEnv = require('dotenv');
dotEnv.config();

const userRoutes = require('./routes/user');
const path = require('path');

const databaseUrl = process.env.DATABASE_URL;
mongoose.connect(databaseUrl)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoutes);


module.exports = app;