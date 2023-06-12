import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

import { getMovie } from '../../api';

interface Props {
  onAdd: (movie: Movie) => void;
}

const defaultPicture
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleQueryOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleAddButtonOnClick = () => {
    if (!movie) {
      return;
    }

    onAdd(movie);
    setMovie(null);
    setQuery('');
  };

  const handleFormOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(movieFromServer => {
        if ('Error' in movieFromServer) {
          setIsError(true);
        } else {
          setMovie({
            title: movieFromServer.Title,
            description: movieFromServer.Plot,
            imgUrl: (movieFromServer.Poster !== 'N/A'
              ? movieFromServer.Poster
              : defaultPicture
            ),
            imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
            imdbId: movieFromServer.imdbID,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormOnSubmit}>
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
              className={cn(
                'input',
                {
                  'is-danger': isError,
                },
              )}
              value={query}
              onChange={handleQueryOnChange}
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
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query.trim()}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButtonOnClick}
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
