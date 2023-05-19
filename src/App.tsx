import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function onAddMovie(movie: Movie) {
    const findCopy = movies.some(item => item.title === movie.title);

    if (!findCopy) {
      setMovies([...movies, movie]);
    }
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAddMovie={(movie) => onAddMovie(movie)}
        />
      </div>
    </div>
  );
};
