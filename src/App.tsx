import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (newMovie: Movie) => {
    setMovies(prevMovies => {
      const isAdded = prevMovies.some(item => (
        item.imdbId === newMovie.imdbId
      ));

      if (!isAdded) {
        return [...prevMovies, newMovie];
      }

      return prevMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleAdd} />
      </div>
    </div>
  );
};
