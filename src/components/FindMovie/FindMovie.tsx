import React, { useState, useEffect } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard'; // Додано імпорт
import classNames from 'classnames';

type Props = {
  addNewFilm: (movie: Movie) => void;
};

const API_URL = 'http://www.omdbapi.com/?apikey=bb65b2a2';
const defaultPicture =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addNewFilm }) => {
  const [query, setQuery] = useState('');
  const [hasQueryError, setHasQueryError] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLOading, setIsLoading] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasQueryError(false);
  };

  // const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.preventDefault();

  //   const normalizedQuery = query.trim().toLowerCase();

  //   setIsLoading(true);

  //   addNewFilm(normalizedQuery)
  //     .then((API_URL) => {

  //   })
  // }

  useEffect(() => {
    setIsSubmitDisabled(query.trim().length === 0);
  }, [query]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      setHasQueryError(true);

      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}&t=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.Response === 'False') {
        setMovie(null);
        setError("Can't find a movie with such a title");
      } else {
        const foundMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster && data.Poster !== 'N/A' ? data.Poster : defaultPicture,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setMovie(foundMovie);
        setError('');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hanldeAddMovie = () => {
    if (movie) {
      addNewFilm(movie);
      setMovie(null);
    }
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
              className={`input ${hasQueryError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleTitleChange}
            />
          </div>
          {hasQueryError && (
            <p className="help is-danger" data-cy="errorMessage">
              Please enter a movie title.
            </p>
          )}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLOading,
              })}
              disabled={isSubmitDisabled}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="submit"
                className="button is-primary"
                onClick={() => {
                  hanldeAddMovie();
                  setQuery('');
                }}
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
