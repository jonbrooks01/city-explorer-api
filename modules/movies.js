'use strict'

const axios = require('axios');
const cache = require('./cache')

function getMovies (request, response, next){
  // try{
    const film = request.query.film
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${film}`;
    const key = 'obj' + film

    console.log(cache)
    
    if(cache[key] && (Date.now() - cache[key].timestamp < 43200000)){
    console.log('cache hit - sending date from cache');
    response.status(200).send(cache[key].data)
    }
    else{
    console.log('cache miss - making a new request to the API')
    axios.get(url)
    .then(res => res.data.results.map(movie  => new Movie(movie)))
    .then(formatData => {
      cache[key] = {};
      cache[key].data = formatData
      cache[key].timestamp = Date.now();

      response.status(200).send(formatData)
    })
    .catch(err => next(err))

  };
  // catch(error){
  //   next(error);
  // }
}

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