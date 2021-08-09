import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovieToList }) => {
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const searchMovie = () => {
    getMovie(title)
      .then((data) => {
        if (data.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
          imdbId: data.imdbID,
        });
        setError(false);
        setTitle('');
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

              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
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
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovieToList(movie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovieToList: PropTypes.func.isRequired,
};
