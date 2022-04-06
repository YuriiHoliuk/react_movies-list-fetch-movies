/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { MouseEvent, FormEvent, memo, useCallback, useState } from 'react';
import { request } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: CallableFunction;
};

export const FindMovie: React.FC<Props> = memo(({ addMovie }) => {
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [title, setTitle] = useState('');

  const fetchMovie = useCallback(
    (event: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      request(title)
        .then(({ Response, Plot, Poster, Title, imdbID }) => {
          setFetchError(Response !== 'True');

          if (Response === 'True') {
            setPreviewMovie({ Plot, Poster, Title, imdbID });
          } else {
            setPreviewMovie(null);
          }
        });
    }, [title],
  );

  const handlChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }, []);

  const onAdd = useCallback(() => {
    setTitle('');
    addMovie(previewMovie);
  }, [previewMovie]);

  return (
    <>
      <form className="find-movie" onSubmit={fetchMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${fetchError && 'is-danger'}`}
              value={title}
              onChange={handlChange}
            />
          </div>

          {fetchError && (
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
              onClick={fetchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAdd}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previewMovie && <MovieCard movie={previewMovie} />}
      </div>
    </>
  );
});
