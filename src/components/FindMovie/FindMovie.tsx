import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getFilm } from '../../films';
import { MovieCard } from '../MovieCard';

type Props = {
  updateMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const { updateMovies } = props;

  const changeMovieTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovieTitle(event.target.value);
    setMovie(null);
    setHasError(false);
  };

  const loadFilm = async () => {
    const film = await getFilm(movieTitle);

    if (film.Response === 'True') {
      setMovie(film);
    } else {
      setHasError(true);
      setMovie(null);
    }
  };

  const handleMovie = () => {
    loadFilm();
  };

  const changeMovieList = () => {
    if (movie !== null) {
      updateMovies(movie);
      setMovieTitle('');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': hasError },
                )}
                value={movieTitle}
                onChange={changeMovieTitle}
              />
            </div>
          </label>
          {hasError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={changeMovieList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
