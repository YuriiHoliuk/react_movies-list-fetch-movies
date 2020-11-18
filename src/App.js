import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export function App() {
  const [movies, setMovies] = useState(data);

  const addMovie = (movie) => {
    setMovies((current) => [...current, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
}
