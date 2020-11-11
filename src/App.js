import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
// import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (movie) => {
    if (movies.some(item => item.imdbID === movie.imdbID)) {
      return;
    }

    setMovies(prevState => [...prevState, movie]);
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
