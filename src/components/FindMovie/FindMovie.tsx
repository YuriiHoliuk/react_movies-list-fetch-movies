/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { moviesfromServer } from '../../public/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: (a: Movie[]) => void
  movies: Movie[] | null;
}

export const FindMovie: React.FC <Props> = ({
  setMovies,
  movies,
}) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);
  const [errorEmpty, setErrorEmpty] = useState(false);

  const findMovies = async () => {
    if (input) {
      const data = await moviesfromServer(input);

      if (data.Response !== 'False') {
        // eslint-disable-next-line no-console
        console.log(data.Response);
        setMovie(await data);
      } else {
        setMovie(null);
        // eslint-disable-next-line no-console
        console.log(data.Response);
        setError(true);
      }
    } else {
      setError(true);
    }

    setInput('');
  };

  const add = () => {
    if (movie && movies) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
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
              value={input}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={error ? 'input is-danger' : 'input'}
              onChange={(event) => {
                setInput(event.target.value);
                setError(false);
                setErrorEmpty(false);
              }}
            />
          </div>

          {!!(error) && (
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
              onClick={findMovies}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                add();
                if (!movie) {
                  setErrorEmpty(true);
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
        {!!(errorEmpty) && (
          <h2 className="help is-danger">
            First find movie to add
          </h2>
        )}
        <MovieCard movie={movie} />
      </div>
    </>
  );
};
