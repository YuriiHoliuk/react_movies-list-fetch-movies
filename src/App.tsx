import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSetMovies = (movie: Movie) => {
    if (!movies.find(item => movie.imdbID === item.imdbID)) {
      setMovies((prev) => ([
        ...prev,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          handleSetMovies={handleSetMovies}
        />
      </div>
    </div>
  );
};
