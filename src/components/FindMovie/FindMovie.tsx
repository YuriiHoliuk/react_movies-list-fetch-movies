import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError('Please enter a movie title.');

      return;
    }

    setError('');
    setMovie(null);
    setIsLoading(true);

    try {
      const result = await getMovie(title);

      if ((result as ResponseError).Response === 'False') {
        setError((result as ResponseError).Error || 'Movie not found');
      } else {
        const data = result as MovieData;

        const normalizedMovie: Movie = {
          imdbId: data.imdbID,
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
        };

        setMovie(normalizedMovie);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (movie) {
      onAddMovie(movie);
      setTitle('');
      setMovie(null);
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
              onChange={event => {
                setTitle(event.target.value);
                if (error) {
                  setError('');
                }
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <div className="card">
            <img src={movie.imgUrl} alt={movie.title} />
            <p>{movie.title}</p>
            <p>{movie.description}</p>
          </div>
        </div>
      )}
    </>
  );
};
