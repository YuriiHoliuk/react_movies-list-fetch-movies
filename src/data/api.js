const BASE__URL = 'https://www.omdbapi.com/';

export function getMovies(title) {
  return fetch(`${BASE__URL}?apikey=3502a4aa&t=${title}`)
    .then(response => response.json());
}
