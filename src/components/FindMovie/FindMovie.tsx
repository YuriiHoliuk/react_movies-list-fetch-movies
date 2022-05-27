import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { getMovieByTitle } from '../../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[],
  setMovies: Dispatch<SetStateAction<Movie[]>>;
};

export const FindMovie: FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isQueryError, setIsQueryError] = useState(false);
  const [isAddedMovie, setIsAddedMovie] = useState(false);

  const findMovie = useCallback(async (title: string) => {
    setIsAddedMovie(false);

    if (!title.trim()) {
      setIsQueryError(true);

      return;
    }

    const request = await getMovieByTitle(title);

    if (request.Response === 'False') {
      setMovie(null);
      setIsQueryError(true);
    } else {
      setMovie(request);
      setIsQueryError(false);
    }
  }, []);

  const handleQuery = (newQuery: string) => {
    setQuery(newQuery);

    if ((newQuery !== query) && (isQueryError || isAddedMovie)) {
      setIsAddedMovie(false);
      setIsQueryError(false);
    }
  };

  const handleSubmit
    = useCallback((
      event: React.FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      findMovie(query);
    }, [query]);

  const handleOnAdd = useCallback(() => {
    const isAdded = movie
      && movies.some((addedMovie) => addedMovie.imdbID === movie.imdbID);

    if (isAdded) {
      setIsAddedMovie(true);
    }

    if (movie && !isAdded) {
      setMovies([...movies, movie]);
      setMovie(null);
      setQuery('');
    }
  }, [movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isQueryError })}
              value={query}
              onChange={({ target }) => handleQuery(target.value)}
            />
          </div>

          {isQueryError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {isAddedMovie && (
            <p className="help is-danger">
              Movie has already been added
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie(query)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleOnAdd}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard movie={movie} />
      </div>
    </>
  );
};
