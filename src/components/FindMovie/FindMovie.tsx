import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { MoviesList } from '../MoviesList';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [movies] = useState<Movie[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);
    setPreviewMovie(null);
    setCountdown(5);

    const countdownInterval = setInterval(() => {
      setCountdown(countdown && (countdown > 1 ? countdown - 1 : null));
    }, 1000);

    getMovie(title)
      .then(data => {
        if ('Response' in data && data.Response === 'False') {
          setError(data.Error || 'Фильм не найден');
        } else {
          const movieData = data as MovieData;
          const defaultPoster =
            'https://via.placeholder.com/360x270.png?text=no%20preview';
          const poster =
            movieData.Poster && movieData.Poster !== 'N/A'
              ? movieData.Poster
              : defaultPoster;
          const movie: Movie = {
            title: movieData.Title,
            imgUrl: poster,
            description: movieData.Plot,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          };

          setPreviewMovie(movie);
          setError(null);
        }
      })
      .catch(() => setError('Ошибка при загрузке фильма'))
      .finally(() => {
        setLoading(false);
        clearInterval(countdownInterval);
        setCountdown(null);
      });
  };

  const handleAddMovie = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
      setTitle('');
      setPreviewMovie(null);
      setError(null);
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
              value={title}
              onChange={handleChange}
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
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
              disabled={!title.trim() || loading}
            >
              {loading ? `Loading... (${countdown ?? 5}s)` : 'Find a movie'}
            </button>
          </div>

          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={previewMovie} />
        </div>
      )}

      {movies.length > 0 && (
        <div className="container" data-cy="moviesList">
          <h2 className="title">Movies List</h2>
          <MoviesList movies={movies} />
        </div>
      )}
    </>
  );
};
