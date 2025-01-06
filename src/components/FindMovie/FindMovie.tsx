import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  setMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundFilm, setFoundFilm] = useState<Movie | null>(null);

  const onFind = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    getMovie(query)
      .then((result) => {
        if ('Error' in result) {
          setFoundFilm(null);
          setError('Cant find a movie with such a title');
        } else {
          const normalizedMovie: Movie = {
            title: result.Title,
            description: result.Plot,
            imgUrl: result.Poster === 'N/A' ?'https://via.placeholder.com/360x270.png?text=no%20preview' : result.Poster,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            imdbId: result.imdbID,
          };
          setFoundFilm(normalizedMovie);
        }
      })
      .catch(() => {
        setError('Something went wrong. Please try again later.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={onFind}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={(event) => {
                setQuery(event.target.value);
                setError('');
              }}
            />
          </div>

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
              className={classNames('button is-light', { 'is-loading': loading })}
              disabled={!query || loading}
            >
              Find a movie
            </button>
          </div>
          {foundFilm && <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              onClick={() => {
                if (foundFilm) {
                  setMovies(foundFilm);
                  setFoundFilm(null);
                  setQuery('');
                }
              }}
            >
              Add to the list
            </button>
          </div>}
          
        </div>
      </form>

      {foundFilm && <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
         <MovieCard movie={foundFilm} />
      </div>}
    </>
  );
};
