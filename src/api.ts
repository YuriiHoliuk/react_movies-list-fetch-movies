import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const apiKey = '8ea7bb8e';
const API_URL = 'https://www.omdbapi.com/';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  const url = `${API_URL}?apikey=${apiKey}&t=${query}`;

  return fetch(url)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
