import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<null | Movie>(null);
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(title)
      .then(response => {
        if (Object.prototype.hasOwnProperty.call(response, 'Error')) {
          setIsError(true);
        }

        const {
          Title,
          Plot,
          imdbID,
          Poster,
        } = response as MovieData;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster !== 'N/A'
            ? Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        return Promise.resolve();
      })
      .catch(() => setIsError(true))
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setTitle('');
    setMovie(null);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={title.trim().length === 0}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
