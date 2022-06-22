import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/api';

import './FindMovie.scss';

type Props = {
  movies: Movie[],
  setMoviesList: (data: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({ setMoviesList, movies }) => {
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<Movie>();
  const [isError, setIsError] = useState(false);

  const searchMovie = () => {
    findMovie(search)
      .then(data => {
        if (data.Response === 'True') {
          setPreview(data);
          setIsError(false);
        } else {
          setPreview(undefined);
          setIsError(true);
        }
      });
  };

  const addNewMovie = () => {
    if (preview) {
      if (!movies.includes(preview)) {
        setMoviesList([...movies, preview]);
      }
    }
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
              className={classNames(
                'input',
                { 'is-danger': isError },
              )}
              data-cy="find"
              value={search}
              onChange={(e) => {
                setIsError(false);
                setPreview(undefined);
                setSearch(e.target.value);
              }}
            />
          </div>

          {isError && (
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
              data-cy="add"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {preview !== undefined && (
              <button
                type="button"
                className="button is-primary"
                onClick={() => addNewMovie()}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {preview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
