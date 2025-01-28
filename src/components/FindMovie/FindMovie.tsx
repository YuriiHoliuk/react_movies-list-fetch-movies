import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  findMovie: (movie: Movie) => void;
};

const defaultPicture =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ findMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShouldFetch(true);
  };

  const handleAddToList = () => {
    if (movie) {
      findMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  useEffect(() => {
    if (!shouldFetch || !query) {
      return;
    }

    const fetchMovie = async () => {
      setIsLoading(true);
      try {
        const fetchedMovie = await getMovie(query);

        if ('Error' in fetchedMovie) {
          setMovie(null);
          setHasError(true);

          // eslint-disable-next-line no-console
          console.error(fetchedMovie.Error);

          return;
        }

        const formattedMovie: Movie = {
          title: fetchedMovie.Title,
          description: fetchedMovie.Plot,
          imgUrl:
            fetchedMovie.Poster && fetchedMovie.Poster !== 'N/A'
              ? fetchedMovie.Poster
              : defaultPicture,
          imdbUrl: `https://www.imdb.com/title/${fetchedMovie.imdbID}`,
          imdbId: fetchedMovie.imdbID,
        };

        setMovie(formattedMovie);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching movie:', error);
        setMovie(null);
      } finally {
        setIsLoading(false);
        setShouldFetch(false);
      }
    };

    fetchMovie();
  }, [shouldFetch, query, findMovie]);

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
              className={cn('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleInputChange}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
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
