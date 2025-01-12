import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  error: boolean;
  setError: (error: boolean) => void;
  handleFindButton: (event: React.FormEvent) => void;
  findedMovie: Movie | null;
  handleAddButton: () => void;
  loading: boolean;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  error,
  setError,
  handleFindButton,
  findedMovie,
  handleAddButton,
  loading,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={handleFindButton}>
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
              className={error ? 'input is-danger' : 'input'}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              className={
                loading ? 'button is-light is-loading' : 'button is-light'
              }
              disabled={!query}
            >
              {findedMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
