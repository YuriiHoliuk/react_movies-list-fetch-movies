import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (movie: Movie) => {
    if (movies.find(oldMovie => oldMovie.imdbId === movie.imdbId)) {
      return;
    }

    setMovies([...movies, movie]);
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
