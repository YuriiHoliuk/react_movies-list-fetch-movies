import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie, normalizeMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [duplicateMovieError, setDuplicateMovieError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);

  const sanitizeQuery = (queryToSanitize: string) => {
    return queryToSanitize.replace(/[^a-zA-Z0-9 ]/g, '').trim();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const sanitizedQuery = sanitizeQuery(query);

    // asynchronous API call to search for query
    getMovie(sanitizedQuery)
      .then(result => {
        if ((result as MovieData).imdbID) {
          setMovie(normalizeMovie(result as MovieData));
        } else {
          setHasError(true);
        }
      })
      .finally(() => {
        setIsLoading(false); // stop loading
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setMovie(null);
    setHasError(false);
    setDuplicateMovieError('');
  };

  const handleAddMovie = () => {
    if (movie) {
      const isAlreadyInList = movies.some((m) => m.imdbId === movie.imdbId);

      if (isAlreadyInList) {
        setDuplicateMovieError('This movie is already in the list!');
        setMovie(null);

        return;
      }

      addMovie(movie);
      setMovies([...movies, movie]);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleChange}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {'Can\'t find a movie with such a title'}
            </p>
          )}

          {duplicateMovieError && (
            <p className="help is-danger" data-cy="errorMessage">
              {duplicateMovieError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
