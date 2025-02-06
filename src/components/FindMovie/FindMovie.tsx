import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovieToList: (movie: Movie) => void;
};

const defaultPoster =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  const formatMovieData = (recievedMovie: MovieData) => {
    return {
      title: recievedMovie.Title,
      description: recievedMovie.Plot,
      imgUrl:
        recievedMovie.Poster !== 'N/A' ? recievedMovie.Poster : defaultPoster,
      imdbUrl: `https://www.imdb.com/title/${recievedMovie.imdbID}`,
      imdbId: recievedMovie.imdbID,
    };
  };

  const findMovie = (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);

    getMovie(title)
      .then(res => {
        if ('Response' in res && res.Response === 'False') {
          setError(true);

          return null;
        }

        return formatMovieData(res as MovieData);
      })
      .then(res => {
        if (!res) {
          return;
        }

        setMovie(res);
      })
      .finally(() => setLoading(false));
  };

  const addMovie = () => {
    if (movie) {
      addMovieToList(movie);
    }

    setMovie(null);
    setTitle('');
    setError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={e => findMovie(e)}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={title}
              onChange={e => {
                setTitle(e.target.value);
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={title ? false : true}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie()}
              >
                Add to the list
              </button>
            )}
          </div>
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
