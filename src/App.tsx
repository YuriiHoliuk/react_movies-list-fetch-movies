import { useCallback, useState } from 'react';

import './App.scss';

import { Movie } from './types/Movie';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((newMovie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.find(movie => movie.imdbId === newMovie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
