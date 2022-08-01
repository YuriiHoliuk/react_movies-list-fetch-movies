import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const findMovie = (newMovie: Movie) => {
    setMovies(currentMovies => {
      currentMovies.some(addedMovies => addedMovies.imdbId === newMovie.imdbId);

      return [...currentMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={findMovie}
        />
      </div>
    </div>
  );
};
