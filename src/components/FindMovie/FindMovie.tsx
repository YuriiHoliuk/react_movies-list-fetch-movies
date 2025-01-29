import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from './../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setFoundMovie(null);

    try {
      const data = await getMovie(title);

      if ('Error' in data) {
        setError(data.Error);
      } else {
        setFoundMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!foundMovie) {
      return;
    }

    onAdd(foundMovie);
    setTitle('');
    setFoundMovie(null);
  };

  return (
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
            onChange={e => {
              setTitle(e.target.value);
              setError('');
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

        {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </form>
  );
};
