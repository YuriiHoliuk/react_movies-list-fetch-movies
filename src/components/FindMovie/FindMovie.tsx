import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[];
  addMovie: (movie: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovie }) => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<null | Movie>(null);
  const [error, setError] = useState<boolean>(false);

  const isMovieData = (data: MovieData | ResponseError): data is MovieData => {
    return 'Title' in data && 'Plot' in data && 'imdbID' in data;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(value.trim())
      .then(data => {
        if (!isMovieData(data)) {
          setError(true);
          setMovieData(null);
        } else {
          setError(false);
          setMovieData({
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster && data.Poster !== 'N/A'
                ? data.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        }
      })
      .catch(dataError => {
        setMovieData(null);
        setError(true);
        // eslint-disable-next-line no-console
        console.error('Fetch error:', dataError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (!movieData) {
      return;
    }

    const movieExist = movies.some(movie => movieData.imdbId === movie.imdbId);

    if (!movieExist) {
      addMovie(movies.concat(movieData));
    }

    setMovieData(null);
    setError(false);
    setValue('');
  };

  const textFieldClass = classNames('input', {
    'is-danger': error,
  });

  const buttonClass = classNames('button is-light', {
    'is-loading': isLoading,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setError(false);
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
              className={textFieldClass}
              value={value}
              onChange={event => handleChange(event)}
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
              className={buttonClass}
              disabled={value.trim().length === 0}
            >
              Find a movie
            </button>
          </div>

          {movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieData} />
        </div>
      )}
    </>
  );
};
