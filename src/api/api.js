// eslint-disable-next-line
const API_URL = `https://www.omdbapi.com/?apikey=5a5359e&t=`;

export function getMovie(title) {
  return fetch(`${API_URL}${title}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
}
