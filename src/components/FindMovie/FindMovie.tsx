import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findMovie = async () => {
    const newMovie = await getMovie(title);

    if (newMovie.Response === 'False') {
      setMovie(null);
      setError(true);

      return;
    }

    setTitle('');
    setMovie(newMovie);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error })}
                onChange={event => {
                  setTitle(event.target.value);
                  setError(false);
                }}
              />
            </div>
          </label>
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie !== null) {
                  addMovie(movie);
                  setTitle('');
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} /> }
      </div>
    </>
  );
};
