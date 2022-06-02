import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleError, setTitleError] = useState(false);
  const [title, setTitle] = useState('');
  const [titleIsEmpty, setTitleIsEmpty] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const changeTitle = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
  }, []);

  const handleSubmit = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  const findMovie = async () => {
    if (!title) {
      setTitleError(false);
      setTitleIsEmpty(true);

      return;
    }

    const newMovie = await getMovie(title);

    if (!newMovie.Title) {
      setTitleIsEmpty(false);
      setTitleError(true);

      return;
    }

    setMovie(newMovie);
    setTitleError(false);
    setTitleIsEmpty(false);
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
              value={title}
              onChange={changeTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': titleError })}
            />
          </div>

          {titleError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {titleIsEmpty && (
            <p className="help is-danger">
              Enter the title
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
              onClick={handleSubmit}
              disabled={movie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard movie={movie} />)}
      </div>
    </>
  );
};
