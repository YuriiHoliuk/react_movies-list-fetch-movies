import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = (newMovie: Movie) => {
    setMovies(prevMovies => {
      return prevMovies.find(({ imdbId }) => imdbId === newMovie.imdbId)
        ? prevMovies
        : [...prevMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
