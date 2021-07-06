import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMoviesByTitle } from '../../api/movies';

export const FindMovie = React.memo(({ addMovie, hasMovie }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => setError(null), [title]);

  async function getMovie() {
    try {
      const findedMovie = await getMoviesByTitle(title);

      if (!findedMovie.Title) {
        setError('Can\'t find a movie with such a title');
        setMovie(null);

        return;
      }

      setMovie({
        title: findedMovie.Title,
        description: findedMovie.Plot,
        imgUrl: findedMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${findedMovie.imdbID}`,
        imdbId: findedMovie.imdbID,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(err);
    }
  }

  function handleSubmit() {
    if (hasMovie(movie)) {
      setError('Already have this movie');

      return;
    }

    addMovie(movie);
    setTitle('');
    setMovie(null);
  }

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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={title}
              onChange={useCallback(
                ({ target }) => setTitle(target.value),
                [],
              )}
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
});

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  hasMovie: PropTypes.func.isRequired,
};
