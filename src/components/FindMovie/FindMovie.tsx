import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovies } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';

type Props = {
  movies: Movie[];
  addMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovies }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(true);

  const loadMovie = async () => {
    const loadedMovie = await getMovies(query);

    setSelectedMovie(loadedMovie);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn(
                'input',
                { 'is-danger': !isMovieFound },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          {!isMovieFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={() => {
                if (query) {
                  loadMovie();
                  setQuery('');
                  setIsMovieFound(true);
                } else {
                  setIsMovieFound(false);
                }
              }}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                if (movies.every(
                  movie => movie.imdbID !== selectedMovie?.imdbID,
                )) {
                  if (selectedMovie && isMovieFound) {
                    addMovies(selectedMovie);
                  }

                  setQuery('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {(selectedMovie && isMovieFound) && (
          <MovieCard movie={selectedMovie} />
        )}
      </div>
    </>
  );
};
