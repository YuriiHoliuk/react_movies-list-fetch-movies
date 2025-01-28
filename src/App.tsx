import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addNewMovie = (movie: Movie) => {
    const alreadyIncludes = movies.some(film => film.imdbId === movie.imdbId);

    if (alreadyIncludes) {
      return;
    }

    const newList = [...movies, movie];

    setMovies(newList);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie findMovie={addNewMovie} />
      </div>
    </div>
  );
};
