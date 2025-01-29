import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // const [count, setCount] = useState(0);

  // function addNewMovie(movie: Movie) => {
  //   const alreadyIncudes = MoviesList.co
  // }
  const addNewFilm = (movie: Movie) => {
    if (!movies.some(m => m.imdbId === movie.imdbId)) {
      const newList = [...movies, movie];

      setMovies(newList);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addNewFilm={addNewFilm} />
      </div>
    </div>
  );
};
