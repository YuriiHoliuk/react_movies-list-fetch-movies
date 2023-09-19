import React, { useContext } from 'react';
import './MoviesList.scss';
import { MovieCard } from '../MovieCard';
import { MovieContext } from '../store/MovieContext';

export const MoviesList: React.FC = () => {
  const { movies } = useContext(MovieContext);

  return (
    <div className="movies">
      {movies.map(movie => (
        <MovieCard
          key={movie.imdbId}
          movie={movie}
        />
      ))}
    </div>
  );
};
