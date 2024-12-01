import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movie: Movie) => {
    if (movies.find(mov => mov.imdbId === movie.imdbId)) {
      return;
    }

    setMovies(prevMovies => [...prevMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie handleAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
