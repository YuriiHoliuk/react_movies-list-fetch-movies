import React, { useState } from 'react';
import './FindMovie.scss';
// eslint-disable-next-line import/no-extraneous-dependencies
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  moviesList: Movie[];
  setMoviesList: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ moviesList, setMoviesList }) => {
  const [isFieldEmpty, setIsFieldEmpty] = useState(true);
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isMoviesLoaded, setIsMoviesLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleAddMovie = () => {
    if (movies.length > 0) {
      const existingMovie = moviesList.find(
        movie => movie.imdbId === movies[0].imdbId,
      );

      if (!existingMovie) {
        setMoviesList([...moviesList, movies[0]]);
      }

      setQuery('');
      setMovies([]);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setQuery(newValue);
    setErrorMessage(false);

    if (newValue.length) {
      setIsFieldEmpty(false);
    } else {
      setIsFieldEmpty(true);
    }
  };

  const findMovie = () => {
    event.preventDefault();

    setIsMoviesLoaded(true);

    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setMovies([]);
          setErrorMessage(true);
        } else {
          const movie: Movie = {
            title: result.Title,
            description: result.Plot,
            imgUrl:
              result.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imdbId: result.imdbID,
          };

          setMovies([movie]);
          setErrorMessage(false);
        }
      })
      .finally(() => setIsMoviesLoaded(false));
  };

  return (
    <>
      <form className="find-movie">
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
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
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
                'is-loading': isMoviesLoaded,
              })}
              onClick={findMovie}
              disabled={isFieldEmpty}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movies.length > 0 && (
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

      {movies.length > 0 && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movies.map(movie => (
            <MovieCard key={movie.imdbId} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
};
