import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    if (movie && movies.every(oldMovie => oldMovie.imdbId !== movie.imdbId)) {
      setMovies((currentMovies: Movie[]) => [...currentMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
