import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

import { Movie } from '../../types/Movie';

const DEFAULT_POSTER_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

function isResponseError(data: Movie | ResponseError): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}

interface Props {
  addMovieToList: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ addMovieToList, movies }) => {
  const [findMovieValue, setFindMovieValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleFindMovieInput = (event: ChangeEvent<HTMLInputElement>) => {
    setFindMovieValue(event.target.value);
    if (error) {
      setError(false);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const data = await getMovie(findMovieValue);

      if (isResponseError(data)) {
        setError(true);
      } else {
        const normalizedMovie: Movie = {
          ...data,
          Poster: data.Poster !== 'N/A' ? data.Poster : DEFAULT_POSTER_URL,
        };

        setMovie(normalizedMovie);
      }
    } catch (errorMessage) {
      setLoading(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToListButton = () => {
    const checkedMovies = movies.filter(item => item.imdbID === movie?.imdbID);

    if (!checkedMovies.length) {
      addMovieToList(movie as Movie);
    }

    setMovie(null);
    setFindMovieValue('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
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
              className={classNames('input', { 'is-danger': error })}
              value={findMovieValue}
              onChange={handleFindMovieInput}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can not find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!findMovieValue}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToListButton}
              >
                Add to the list
              </button>
            )}
          </div>
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
