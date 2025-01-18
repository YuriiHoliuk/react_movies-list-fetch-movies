import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

function getNoramalizedMovie(movieData: MovieData): Movie {
  const { Poster, Title, Plot, imdbID } = movieData;

  return {
    title: Title,
    description: Plot,
    imgUrl: `${Poster === 'N/A' ? 'https://via.placeholder.com/360x270.png?text=no%20preview' : Poster}`,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
}

type Props = {
  onMoviesAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMoviesAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsLoading(true);

    const formattedQuery = query.trim().toLowerCase();

    getMovie(formattedQuery)
      .then(movieData => {
        if ((movieData as ResponseError).Error !== undefined) {
          setHasError(true);

          return;
        }

        setMovie(getNoramalizedMovie(movieData as MovieData));
      })
      .finally(() => setIsLoading(false));
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setHasError(false);
  }

  function handleAddToTheList() {
    setMovie(null);
    setQuery('');
    setHasError(false);

    if (movie) {
      onMoviesAdd(movie);
    }
  }

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
              className={cn('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleTitleChange}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
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
                onClick={handleAddToTheList}
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
