import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';
import { fetchMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, changeTitle] = useState('');
  const [loadMovie, createMovie] = useState(movies[0]);
  const [error, setError] = useState(false);

  const findMovie = async() => {
    const movie = await fetchMovie(movieTitle);

    if (movie.Response === 'False') {
      setError(true);

      return;
    }

    setError(false);

    createMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });
  };

  const handleChange = (event) => {
    changeTitle(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    changeTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              type="text"
              name="input"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={movieTitle}
              onChange={handleChange}
              autoComplete="off"
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
              type="submit"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(loadMovie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...loadMovie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
