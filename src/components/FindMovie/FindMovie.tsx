import React, {
  FormEvent,
  useCallback,
  useState,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../api/api';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [queryError, setQueryError] = useState('');

  const onSearch = useCallback(() => {
    if (!query.trim()) {
      setQueryError('Enter a search term!');
    } else {
      const findMovie = async () => {
        const searchResult = await getMovies(query);

        if (searchResult.Response === 'True') {
          setMovie(searchResult);
          setQueryError('');
        } else {
          setQueryError('No movie by that name');
        }
      };

      findMovie();
    }
  }, [query]);

  const onAdd = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!queryError && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, queryError]);

  return (
    <>
      <form className="find-movie" onSubmit={onAdd}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          {queryError && (
            <p className="help is-danger">
              {queryError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
