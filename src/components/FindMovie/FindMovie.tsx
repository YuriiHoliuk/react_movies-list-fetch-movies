import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie:(movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [quary, setQuary] = useState('');
  const [error, setError] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetResponseFromServer = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);

    getMovie(quary).then(serverData => {
      if ('Response' in serverData && serverData.Response === 'False') {
        setError(serverData);
      } else {
        setMovie(() => {
          const mov = serverData as MovieData;
          const movieObject: Movie = {
            title: mov.Title,
            description: mov.Plot,
            imgUrl: mov.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : mov.Poster,
            imdbUrl: `https://www.imdb.com/title/${mov.imdbID}`,
            imdbId: mov.imdbID,
          };

          return movieObject;
        });
      }
    })
      .finally(() => setLoading(false));
  };

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuary(event.target.value);
    setError(null);
  };

  const handleAddMovieButton = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuary('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleGetResponseFromServer}
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={quary}
              onChange={handleChangeInput}
            />
          </div>

          {error
          && (
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
              disabled={!quary}
            >
              Find a movie
            </button>
          </div>

          {!!movie
          && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
