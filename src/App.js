import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);

  const addMovie = (findedMovie) => {
    setMovie((availableMovies) => {
      if (availableMovies.every(movie => movie.imdbID !== findedMovie.imdbID)
        && findedMovie.imdbID) {
        return [...availableMovies, findedMovie];
      }

      return availableMovies;
    });
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
