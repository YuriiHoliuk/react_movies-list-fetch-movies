import React, { useMemo, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { normalizeMovieData } from '../../helpers';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({
  setMovies,
  movies,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChangeSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
    setIsError(false);
  };

  const handleSubmitButton = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(searchQuery)
      .then((result => {
        if ('Error' in result) {
          setIsError(true);
        } else {
          setMovieData(result);
          setIsError(false);
        }
      }))
      .finally(() => setIsLoading(false));
  };

  const newMovie = useMemo(() => {
    if (movieData) {
      return normalizeMovieData(movieData);
    }

    return null;
  }, [movieData]);

  const clearForm = () => {
    setMovieData(null);
    setSearchQuery('');
  };

  const handleClickAddButton = () => {
    const isNewMovieInMovies = movies.some(
      movie => movie.imdbId === newMovie?.imdbId,
    );

    if (newMovie && !isNewMovieInMovies) {
      setMovies((prevMovies) => [...prevMovies, newMovie]);
    }

    clearForm();
  };

  const canShowElement = !isError && movieData;

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmitButton}
      >
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
              className="input is-danger"
              value={searchQuery}
              onChange={handleChangeSearchInput}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!searchQuery}
            >
              Find a movie
            </button>
          </div>

          {canShowElement && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClickAddButton}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {canShowElement && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
