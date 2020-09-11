const OMDB_API = 'http://www.omdbapi.com/?apikey=65c1586c&t=';

export const getMovie = title => fetch(`${OMDB_API}${title}`)
  .then(response => response.json());
