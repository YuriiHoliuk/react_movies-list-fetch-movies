import React, { ChangeEventHandler, FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { DEFAULT_PICTURE } from '../../types/DefaultTypes';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorType, setErrorType] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!query.trim()) {
      setIsError(true);
      setErrorType('Invalid title');
    }

    event.preventDefault();
    setIsLoading(true);

    const movieData = await getMovie(query);

    if ('Error' in movieData) {
      setIsError(true);
      setIsLoading(false);
      setErrorType('Can not find a movie');

      return;
    }

    const {
      Title,
      Plot,
      Poster,
      imdbID,
    } = movieData;

    const currentMovie = {
      title: Title,
      description: Plot,
      imgUrl: Poster !== 'N/A'
        ? Poster
        : DEFAULT_PICTURE,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    };

    setMovie(currentMovie);

    setIsLoading(false);
  };

  const handleInput: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    onAddMovie(movie);
    setMovie(null);
    setQuery('');
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
              value={query}
              onChange={handleInput}
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorType}
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
              disabled={!query}
            >

              {!movie
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
