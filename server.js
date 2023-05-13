'use strict'

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');

const app = express();

app.use(cors())

const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.status(200).send('Hi! Your default port is working')
});

app.get('/weather', getWeather); 

app.get('/movie', getMovies);

app.get('*', (req, res) => {
  res.status(404).send('Not Found')
});

app.use((error,req,res,next) => {
  res.status(500).send('Hey, its broken sorry!');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
