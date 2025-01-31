import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { getMovie } from '../../api';

type Props = {
  addNewFilm: (movie: Movie) => void;
};

const defaultPicture =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addNewFilm }) => {
  const [query, setQuery] = useState('');
  const [hasQueryError, setHasQueryError] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasQueryError(false);
  };

  useEffect(() => {
    setIsSubmitDisabled(query.trim().length === 0);
  }, [query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setHasQueryError(true);

      return;
    }

    setIsLoading(true);
    const data = await getMovie(query);

    if ('Error' in data) {
      setMovie(null);
      setError(data.Error);
    } else {
      const foundMovie: Movie = {
        title: data.Title,
        description: data.Plot,
        imgUrl:
          data.Poster && data.Poster !== 'N/A' ? data.Poster : defaultPicture,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      };

      setMovie(foundMovie);
      setError('');
    }

    setIsLoading(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      addNewFilm(movie);
      setMovie(null);
      setQuery('');
    }
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
              className={`input ${hasQueryError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleTitleChange}
            />
          </div>
          {hasQueryError && (
            <p
              className={`help ${hasQueryError ? 'is-danger' : ''}`}
              data-cy="errorMessage"
            >
              Please enter a movie title.
            </p>
          )}
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
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
              disabled={isSubmitDisabled}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
