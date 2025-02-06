import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const formatMovieData = (receivedMovie: MovieData): Movie => {
    return {
      title: receivedMovie.Title,
      description: receivedMovie.Plot,
      imgUrl:
        receivedMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : receivedMovie.Poster,
      imdbId: receivedMovie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${receivedMovie.imdbID}`,
    };
  };

  const findMovie = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(res => {
        if ('Response' in res && res.Response === 'False') {
          setError(true);

          return null;
        }

        return formatMovieData(res as MovieData);
      })
      .then(res => {
        if (!res) {
          return;
        }

        setMovie(res);
      })
      .finally(() => setLoading(false));
  };

  const addMovie = () => {
    if (movie) {
      onAdd(movie);
    }

    setQuery('');
    setError(false);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
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
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {error && (
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
                'is-loading': loading,
              })}
              disabled={!query}
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
                onClick={addMovie}
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
