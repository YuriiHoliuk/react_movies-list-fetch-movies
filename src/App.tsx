import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC<{}> = () => {
  const [movies, SetMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      SetMovies(current => [...current, newMovie]);

      return null;
    }

    return newMovie;
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
