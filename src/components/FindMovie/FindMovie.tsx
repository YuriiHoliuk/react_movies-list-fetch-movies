import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
}) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleFindMovie = () => {
    setLoader(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          return Promise.reject();
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });

        return Promise.resolve();
      })

      .catch(() => setError(true))
      .finally(() => setLoader(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => event.preventDefault()}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
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
              className={classNames(
                'button is-light',
                { 'is-loading': loader },
              )}
              disabled={!query}
              onClick={() => handleFindMovie()}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
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
