import { BASE_URL } from '../constants/api';
import { MovieFromApi } from '../constants/types';

export const loadMovie = async (title: string): Promise<MovieFromApi> => {
  const response = await fetch(`${BASE_URL}&t=${title}`);

  return response.json();
};
