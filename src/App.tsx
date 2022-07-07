import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback(
    (newMovie: Movie) => {
      setMovies([...movies, newMovie]);
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          handleAddMovie={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
};
