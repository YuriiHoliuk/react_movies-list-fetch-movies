import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAdd = (newMovie: Movie) => {
    const isMovieAlready = movies.find(
      movie => movie.imdbId === newMovie.imdbId,
    );

    if (!isMovieAlready) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleAdd={handleAdd} />
      </div>
    </div>
  );
};
