import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (newMovie) => {
    const hasSameMovie = movies.find(movie => newMovie.imdbId === movie.imdbId);

    if (!hasSameMovie) {
      const cloneMovies = movies.map(movie => ({ ...movie }));

      setMovies([
        ...cloneMovies,
        newMovie]);
    }
  };

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
