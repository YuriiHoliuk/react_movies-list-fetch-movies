import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie } = props;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [request, setRequest] = useState<string>('');
  const [isValid, setValid] = useState<boolean>(true);

  const loadMovie = async () => {
    const movieFromApi = await getMovie(request);

    if (movieFromApi.Response === 'False') {
      setMovie(null);
      setValid(false);

      return;
    }

    setMovie(movieFromApi);
    setValid(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRequest(event.target.value);
  };

  const hanleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    loadMovie();
    setRequest('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={hanleSubmit}
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
              value={request}
              onChange={handleChange}
            />
          </div>

          {!isValid && (
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
                addMovie(movie as Movie);
                setMovie(null);
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
