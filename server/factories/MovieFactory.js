const Movie = require('../models/Movie');

class MovieFactory {
  static createMovie(data) {
    // You can add additional logic here if needed (e.g., validation, defaults)
    return new Movie({
      title: data.title,
      description: data.description,
      duration: data.duration,
      genre: data.genre,
      releaseDate: data.releaseDate,
      posterUrl: data.posterUrl,
      capacity: data.capacity,
      screenType: data.screenType,
      amenities: data.amenities || [],
      showtimes: data.showtimes || []
    });
  }
}

module.exports = MovieFactory;



