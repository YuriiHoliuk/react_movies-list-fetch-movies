import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getNormalizeMovie } from '../../utils/getNormalizeMovie';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  addMovie: (movie: Movie) => void,
  errorMessage: ErrorMessage,
  changeErrorMessage: (message: ErrorMessage) => void,
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  errorMessage,
  changeErrorMessage,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const movieFromServer = await getMovie(query);

      if ('Error' in movieFromServer) {
        setIsLoading(false);
        changeErrorMessage(ErrorMessage.NOMOVIE);

        return;
      }

      setMovie(getNormalizeMovie(movieFromServer));
    } finally {
      setIsLoading(false);
    }
  };

  const reset = useCallback(() => {
    setMovie(null);
    setQuery('');
  }, []);

  const handleAdd = useCallback(() => {
    if (movie) {
      addMovie(movie);
      reset();
    }
  }, [movie]);

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      changeErrorMessage(ErrorMessage.NONE);
    }, [],
  );

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className="input is-dander"
              value={query}
              onChange={handleInput}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                onClick={handleAdd}
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
