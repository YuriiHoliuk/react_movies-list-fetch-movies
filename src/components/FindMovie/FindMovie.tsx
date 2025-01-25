import React, { useState } from 'react';
import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const transformMovieDataToMovie = (movieData: MovieData): Movie => {
    const IMDB_URL = 'https://www.imdb.com/title/';
    const STD_URL = 'https://via.placeholder.com/360x270.png?text=no%20preview';
    const imgUrl =
      movieData.Poster === 'N/A' || !movieData.Poster
        ? STD_URL
        : movieData.Poster;

    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl,
      imdbId: movieData.imdbID,
      imdbUrl: IMDB_URL + movieData.imdbID,
    };
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query.trim().toLowerCase())
      .then((data: MovieData | ResponseError) => {
        if (data.Response === 'True') {
          setMovie(transformMovieDataToMovie(data));
          setError('');
        } else {
          setMovie(null);
          setError(data.Error);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    onAddMovie(movie as Movie);
    setMovie(null);
    setQuery('');
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
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQueryChange}
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
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
