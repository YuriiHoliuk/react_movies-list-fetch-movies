import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = (
  { addMovie },
) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handlSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(movieadd => {
        if ('Error' in movieadd) {
          setError(true);
        } else {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = movieadd;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      }).catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  const handlAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setMovie(undefined);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        // onSubmit={() => handlSubmit}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
              onClick={handlSubmit}
            >
              {movie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlAddMovie}
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
