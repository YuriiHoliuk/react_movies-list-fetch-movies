import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { isTheSameMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie): void => {
    if (isTheSameMovie(movies, newMovie)) {
      return;
    }

    setMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
