/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[]
  setMovies: (arg: Movie[]) => void
};
export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  // eslint-disable-next-line max-len
  const [moviedata, setMoviedata] = useState<MovieData | undefined>();
  const [errorMessage, setErrorMessage] = useState(false);
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');

  useEffect(() => {
    if (moviedata) {
      setMovie({
        title: moviedata.Title,
        description: moviedata.Plot,
        imgUrl: moviedata.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : moviedata.Poster,

        imdbUrl: `https://www.imdb.com/title/${moviedata.imdbID}`,
        imdbId: moviedata.imdbID,
      });
    }
  }, [moviedata]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          getMovie(movieTitle)

            .then(res => {
              if ('imdbID' in res) {
                setMoviedata(res);
                setErrorMessage(false);
              } else {
                setErrorMessage(true);
              }
            })
            .finally(() => setLoading(false));
        }}
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
              value={movieTitle}
              onChange={(e) => {
                setMovieTitle(e.target.value);
                if (movieTitle !== e.target.value) {
                  setErrorMessage(false);
                }
              }}
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': errorMessage,
              })}
            />
          </div>

          { errorMessage && (
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
              disabled={!movieTitle}
              className={cn('button is-light', { 'is-loading': loading })}
            >
              {moviedata ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {moviedata && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    if (movies.length === 0) {
                      setMovies([...movies, movie]);
                    // eslint-disable-next-line max-len
                    } else if (movies.some(item => item.title === movie.title) && movies.length > 0) {
                      setMoviedata(undefined);
                      setMovieTitle('');
                      setErrorMessage(false);

                      return;
                    }

                    setMovies([...movies, movie]);
                    setMoviedata(undefined);
                    setMovieTitle('');
                    setErrorMessage(false);
                  }
                }}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {moviedata
      && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
