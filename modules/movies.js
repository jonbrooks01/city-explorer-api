'use strict'

const axios = require('axios');

function getMovies (request, response, next){
  // try{
    const film = request.query.film
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${film}`;
    axios.get(url)
    .then(res => res.data.results.map(movie  => new Movie(movie)))
    .then(formatData => response.status(200).send(formatData))
    .catch(err => next(err))

  };
  // catch(error){
  //   next(error);
  // }

class Movie {
  constructor(obj) {
    this.name = obj.original_title
    this.overview = obj.overview
    this.average_vote = obj.vote_average
    this.count = obj.vote_count
    this.release_date = obj.release_date
    this.popularity = obj.popularity
    this.poster = obj.poster_path
  }
}


module.exports = getMovies;