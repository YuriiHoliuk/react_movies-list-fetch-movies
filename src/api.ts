import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=aa46991e';

// eslint-disable-next-line max-len
export const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
