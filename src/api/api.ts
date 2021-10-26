export const getMovie = (title: string) => {
  return fetch(`https://www.omdbapi.com/?apikey=eb45420d&t=${title}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status} - ${response.statusText}`);
      }

      return response.json();
    });
};
