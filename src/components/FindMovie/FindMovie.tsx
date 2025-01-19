import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovieToList: (movie: Movie) => void;
};

const isResponseError = (
  data: MovieData | ResponseError,
): data is ResponseError => {
  return (data as ResponseError).Response === 'False';
};

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMovie(null);
    setIsLoading(true);

    try {
      const result = await getMovie(title);

      if (isResponseError(result)) {
        setError(result.Error);
      } else {
        const transformedMovie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl: `${result.Poster === 'N/A' ? 'https://via.placeholder.com/360x270.png?text=no%20preview' : result.Poster}`,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setMovie(transformedMovie);
      }
    } catch {
      setError('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;

    setTitle(newTitle);

    if (newTitle !== '') {
      setError(null);
    }
  };

  const handleAddToList = () => {
    if (movie) {
      addMovieToList(movie);
      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className="input"
              value={title}
              onChange={handleInputChange}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={title.trim() === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
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
