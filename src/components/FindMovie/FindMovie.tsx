import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(function FindMovie({
  addMovie,
}) {
  const [title, setTitle] = useState('');

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (isLoading) {
      const cleanTitle = title.trim().toLowerCase();

      getMovie(cleanTitle).then(response => {
        setIsLoading(false);

        if (Object.hasOwn(response, 'Error')) {
          setHasError(true);
        } else {
          const newMovie = response as MovieData;

          setMovie({
            title: newMovie.Title,
            description: newMovie.Plot,
            imgUrl:
              newMovie.Poster !== 'N/A'
                ? newMovie.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
            imdbId: newMovie.imdbID,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const onSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
  }, []);

  const handleAdding = useCallback(() => {
    addMovie(movie!);

    setTitle('');
    setMovie(null);
    setHasError(false);
  }, [addMovie, movie]);

  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      setHasError(false);
    },
    [],
  );

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={classNames('input', { 'is-danger': hasError })}
              value={title}
              onChange={handleTextChange}
            />
          </div>

          {hasError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.length}
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
                onClick={handleAdding}
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
});
