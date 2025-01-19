import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [search, setSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search && title) {
      setLoading(true);
      getMovie(title)
        .then(data => {
          if (data.Response === 'True') {
            setMovie({
              imdbId: data.imdbID,
              title: data.Title,
              description: data.Plot,
              imgUrl:
                data.Poster !== 'N/A'
                  ? data.Poster
                  : 'https://via.placeholder.com/360x270.png?text=no%20preview',
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            });
          } else {
            setHasError(true);
            setMovie(null);
          }
        })
        .finally(() => {
          setLoading(false);
          setSearch(false);
        });
    }
  }, [search, title]);

  const reset = () => {
    setTitle('');
  };

  const handleAddMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasError(false);
    setSearch(true);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleAddMovie}>
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
              className={hasError ? 'input is-danger' : 'input'}
              value={title}
              onChange={event => {
                setTitle(event.target.value);
                setHasError(false);
              }}
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
              className={!loading ? 'button is-light' : 'button is-loading'}
              disabled={!title}
            >
              Find a movie
            </button>
          </div>

          {movie && title && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(movie);
                  reset();
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
