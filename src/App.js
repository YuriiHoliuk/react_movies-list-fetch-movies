import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);

  const insertMovie = (inputMovie) => {
    const hasDuplicate = movies.some(
      movie => movie.imdbId === inputMovie.imdbId,
    );

    if (!hasDuplicate) {
      addMovie([...movies, inputMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie insertMovie={insertMovie} />
      </div>
    </div>
  );
};
