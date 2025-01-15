//import { Movie } from './types/Movie';
import { Movie } from './types/Movie';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=8187ae7f';

export function getMovie(query: string): Promise<Movie | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
