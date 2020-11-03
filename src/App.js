import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (newMovie) => {
    setMovies([
      ...movies,
      newMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length === 0 ? (
          <h1>
            {`It's empty, so add your favourite movies! `}
          </h1>
        ) : (
          <MoviesList movies={movies} />
        )}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} movies={movies} />
      </div>
    </div>
  );
};
