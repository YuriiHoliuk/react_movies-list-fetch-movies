import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [wasMovieFound, setWasMovieFound] = useState(false);
  const [isFindMovie, setIsFindMovie] = useState(false);

  const handleChange = (event) => {
    setQuery(event.target.value);
    setIsFindMovie(false);
  };

  const findMovie = () => {
    loadMovie(query).then((response) => {
      if (response.Response === 'False') {
        setIsFindMovie(true);

        return;
      }

      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
      setWasMovieFound(true);
      setQuery('');
    });
  };

  const addToMovies = () => {
    setWasMovieFound(false);
    addMovie(movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
      >
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
              value={query}
              onChange={event => handleChange(event)}
            />
          </div>

          {isFindMovie && (
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
              onClick={addToMovies}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {wasMovieFound && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
