import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const DEFAULT_IMG =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const isSubmitButtonDisabled = !query.trim();

  const handleFindMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setIsError(true);
        } else {
          const { Title, Plot, Poster, imdbID } = data;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsError(false);
  };

  const handleAddNewMovie = () => {
    addMovie(movie as Movie);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
                'is-danger': isError,
              })}
              value={query}
              onChange={handleChangeInput}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={isSubmitButtonDisabled}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddNewMovie}
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
