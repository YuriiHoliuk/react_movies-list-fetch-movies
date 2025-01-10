import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

function extractMovie(rawData: MovieData): Movie {
  return {
    title: rawData.Title,
    description: rawData.Plot,
    imgUrl:
      rawData.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : rawData.Poster,
    imdbUrl: `https://www.imdb.com/title/${rawData.imdbID}`,
    imdbId: rawData.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim().toLowerCase();

    setIsLoading(true);
    getMovie(normalizedQuery)
      .then(response => {
        if (Object.hasOwn(response as ResponseError, 'Error')) {
          setHasError(true);

          return;
        }

        setMovie(extractMovie(response as MovieData));
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setHasError(false);
              }}
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
              disabled={!query}
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
