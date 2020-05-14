import React from 'react';

import './MoviesList.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: MovieCard[];
};

export const MoviesList: React.FC<Props> = ({
  movies = [],
}) => (
  <div className="movies">
    {movies.map((movie) => (
      <MovieCard key={movie.imdbId} {...movie} />
    ))}
  </div>
);
