import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  handleClick: (movie: Movie | null) => void,
};

export const FindMovie: React.FC<Props> = ({
  handleClick = () => { },
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleAdd = () => {
    handleClick(movie);
    setMovie(null);
    setQuery('');
  };

  const handleSubmit = (
    event:
    React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      .then(movieData => {
        const { Response } = movieData as ResponseError;

        if (Response === 'False') {
          setHasError(true);
        } else {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = movieData as MovieData;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster,
            imdbUrl: imdbID,
            imdbId: imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
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
              value={query}
              onChange={handleQueryChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': hasError,
              })}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          {query ? (
            <div className="control">
              <button
                onClick={handleSubmit}
                data-cy="searchButton"
                type="submit"
                className={classNames('button is-light', {
                  'is-loading': isLoading,
                })}
              >
                Find a movie
              </button>
            </div>
          ) : (
            <div className="control">
              <button
                disabled
                type="submit"
                data-cy="searchButton"
                className="button is-light"
              >
                Find a movie
              </button>
            </div>
          )}

          <div className="control">
            {movie && (
              <button
                onClick={handleAdd}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
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
