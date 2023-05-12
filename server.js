'use strict'

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const weatherData = require('./data/weather.json')

const app = express();

app.use(cors())

const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.status(200).send('Hi! Your default port is working')
});

app.get('/weather', getWeather); 

async function getWeather (request, response, next) {
  try {
    const {lat,lon} = request.query
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${process.env.WEATHER_API_KEY}`
    const weatherResponse = await axios.get(url);
    const formattedData = weatherResponse.data.data.map(day => new Forecast(day))
    response.status(200).send(formattedData);
  }
  catch (error) {
    next(error);
  }
};

app.get('/', (request, response) => {
  response.status(200).send('Hi! Your default port is still working')
})

app.get('/movie', getMovies);

async function getMovies (request, response, next){
  try{
    const film = request.query.film
    const url1 = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${film}`;
    const movieResponse = await axios.get(url1);
    const formatData = movieResponse.data.results.map(film1 => new Movie(film1))
    response.status(200).send(formatData);
    console.log(formatData);
  }
  catch(error){
    next(error);
  }
};

class Movie {
  constructor(obj) {
    this.name = obj.title
    this.overview = obj.overview
    this.average_vote = obj.vote_average
    this.count = obj.vote_count
    this.release_date = obj.release_date
    this.popularity = obj.popularity
    this.poster = obj.poster_path
  }
}


class Forecast {
  constructor(obj) {
    this.date = obj.datetime
    this.description = obj.weather.description
    this.temp = obj.temp
    this.appTemp = obj.app_temp
  }
}

app.get('*', (req, res) => {
  res.status(404).send('Not Found')
});

app.use((error,req,res,next) => {
  res.status(500).send('Hey, its broken sorry!');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
