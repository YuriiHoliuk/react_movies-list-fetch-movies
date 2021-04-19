import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovies }) => {
  const [movie, setMovie] = useState('');
  const [movieTitle, setMovieTitle] = useState('');

  const findMovie = () => {
    getMovie(movieTitle)
      .then(result => setMovie(result));
  };

  const clearMovie = () => {
    setMovie('');
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
              className="input is-danger"
              value={movieTitle}
              onChange={(e) => {
                setMovieTitle(e.target.value);
              }}
            />
          </div>
          {(movie && !movie.Title) && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie.Title) {
                  addMovies(movie);
                  clearMovie();
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie.Title
        && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovies: PropTypes.func.isRequired,
};
