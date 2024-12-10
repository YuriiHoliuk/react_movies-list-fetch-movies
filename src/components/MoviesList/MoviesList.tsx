import React from 'react';
import './MoviesList.scss';
import MovieCard from '../MovieCard/MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[];
};

const MoviesList: React.FC<Props> = React.memo(({ movies }) => (
  <div className="movies">
    {movies.map(movie => (
      <MovieCard key={movie.imdbId} movie={movie} />
    ))}
  </div>
));

MoviesList.displayName = 'MoviesList';
export default MoviesList;
