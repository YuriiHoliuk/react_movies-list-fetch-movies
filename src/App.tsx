import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFindButton = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setError(true);

          return;
        }

        setError(false);
        setFindedMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl:
            response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleAddButton = () => {
    if (findedMovie) {
      const addedMovie = movies.find(
        movie => movie.imdbId === findedMovie.imdbId,
      );

      if (!addedMovie) {
        setMovies([...movies, findedMovie]);
      }

      setQuery('');
      setFindedMovie(null);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          error={error}
          setError={setError}
          handleFindButton={handleFindButton}
          findedMovie={findedMovie}
          handleAddButton={handleAddButton}
          loading={loading}
        />
      </div>
    </div>
  );
};
