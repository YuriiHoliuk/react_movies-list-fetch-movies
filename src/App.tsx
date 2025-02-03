import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { NormilizeMovie } from './utils/NormalizeMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [findedMovie, setFindedMovie] = useState<Movie | undefined>();
  const [isError, setIsError] = useState(false);

  const handleSearch = (localQuery: string) => {
    setIsLoading(true);

    getMovie(localQuery)
      .then(movie => {
        if ('Error' in movie) {
          setFindedMovie(undefined);
          setIsError(true);
        } else {
          setFindedMovie(NormilizeMovie(movie));
          setIsError(false);
        }
      })
      .catch(() => {
        setFindedMovie(undefined);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleQuery = (formQuery: string) => {
    // setQuery(formQuery);
    handleSearch(formQuery);
  };

  const handleAddMovie = (newMovie: Movie) => {
    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setFindedMovie(undefined);
    } else {
      setMovies(prevMovies => [...prevMovies, newMovie]);
      setFindedMovie(undefined);
    }
  };

  const handleIsError = (error: boolean) => {
    setIsError(error);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={findedMovie}
          handleQuery={handleQuery}
          isLoading={isLoading}
          isError={isError}
          handleIsError={handleIsError}
          handleAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
