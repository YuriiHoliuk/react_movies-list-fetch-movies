import { Movie } from './Movie';
import { MovieData } from './MovieData';

export const movieDataToMovie = (data: MovieData): Movie => ({
  title: data.Title,
  imgUrl: data.Poster,
  description: data.Plot,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  imdbId: data.imdbID,
});
