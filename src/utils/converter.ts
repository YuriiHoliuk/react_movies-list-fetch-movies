import { MovieData } from '../types/MovieData';
import { Movie } from '../types/Movie';

const DEFAULT_IMG_URL = ''
  + 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function convertMovieData({
  Title,
  Poster,
  Plot,
  imdbID,
}:MovieData):Movie {
  return {
    title: Title,
    description: Plot,
    imgUrl: Poster === 'N/A' ? DEFAULT_IMG_URL : Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}
