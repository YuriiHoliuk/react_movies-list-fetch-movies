import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';

import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState();

  const getMovie = async(title) => {
    const movieFromServer = await getMovieByTitle(title);

    if (movieFromServer.Response === 'False') {
      setMovie(null);
      setError(true);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl: movieFromServer.Poster,
      imdbId: movieFromServer.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
    });
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
              className={classnames('input', {
                'is-danger': error,
              })}
              autoComplete="off"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              onClick={() => getMovie(query)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                setQuery('');
                onMovieAdd(movie);
              }}
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
};

FindMovie.propTypes = {
  onMovieAdd: PropTypes.func.isRequired,
};
