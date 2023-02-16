import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=39f9cfa7';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
