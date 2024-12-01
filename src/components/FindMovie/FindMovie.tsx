import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  handleAddMovies: (movie: Movie) => void;
};

function normalizeMovieData(movieData: MovieData): Movie {
  const poster = movieData.Poster !== 'N/A'
    ? movieData.Poster
    : 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return {
    title: movieData.Title,
    description: movieData.Plot,
    imgUrl: poster,
    imdbId: movieData.imdbID,
    imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
  };
}

export const FindMovie: React.FC<Props> = ({ handleAddMovies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [hasError, setHasError] = useState(false);

  const handleSearchMovie = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    getMovie(query)
      .then(response => {
        if (Object.hasOwn(response, 'Error')) {
          setHasError(true);
        } else {
          const movieData = normalizeMovieData(response as MovieData);

          setMovie(movieData);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      handleAddMovies(movie);
    }

    setQuery('');
    setMovie(undefined);
  };

  useEffect(() => {
    setHasError(false);
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSearchMovie}>
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
              className={classNames('input', { isDanger: hasError })}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              className={classNames(
                'button is-light', { 'is-loading': loading },
              )}
              disabled={!query.length}
            >
              Find a movie
            </button>
          </div>
          {query && (
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
