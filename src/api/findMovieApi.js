const BASE_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=66d63ac4';

export function getMovie(title) {
  return fetch(`${BASE_URL}&t=${title}`)
    .then(response => response.json())
    .catch((error) => {
      throw new Error(error);
    });
}
