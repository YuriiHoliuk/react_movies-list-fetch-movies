import React, { useState } from 'react';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  //#region state
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  //#endregion

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(false);
  };

  const handleSubmitChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then((res: MovieData | ResponseError) => {
        if ('Response' in res && res.Response === 'False') {
          setErrorMessage(true);
          setMovie(null);
        } else {
          setErrorMessage(false);

          const DEFAULT_IMG =
            'https://via.placeholder.com/360x270.png?text=no%20preview';

          const { Title, Plot, Poster, imdbID } = res as MovieData;

          const imgUrl =
            Poster && Poster.trim() !== 'N/A' ? Poster : DEFAULT_IMG;

          const normalizedMovie = {
            title: Title,
            description: Plot,
            imgUrl: imgUrl,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(normalizedMovie);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    onAdd(movie as Movie);
    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitChange}>
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
              className={`input ${errorMessage && 'is-danger'}`}
              value={query}
              onChange={handleInputChange}
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
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading && 'is-loading'}`}
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
