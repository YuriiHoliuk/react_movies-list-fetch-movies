const API_URL = `https://www.omdbapi.com/?apikey=e9bcb344&t=`;

export const findMovie = async(title) => {
  const movie = await fetch(`${API_URL}${title}`);

  return movie.json();
};
