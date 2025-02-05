import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [mistake, setMistake] = useState(false);
  const [loading, setLoading] = useState(false);

  function transformMovieData(movieTransform: MovieData): Movie {
    return {
      title: movieTransform.Title,
      description: movieTransform.Plot,
      imgUrl: movieTransform.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieTransform.imdbID}`,
      imdbId: movieTransform.imdbID,
    };
  }

  async function getResponse(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const movie = await getMovie(query);

      if ('Response' in movie && movie.Response === 'False') {
        setMovieData(null);
        setMistake(true);
      } else if ('Poster' in movie) {
        setMistake(false);
        setMovieData({
          ...(movie as MovieData),
          Poster:
            movie.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movie.Poster,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function addMovie() {
    onAdd(transformMovieData(movieData as MovieData));
    setMovieData(null);
    setQuery('');
  }

  return (
    <>
      <form className="find-movie" onSubmit={getResponse}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={event => {
                setQuery(event.target.value);
                setMistake(false);
              }}
              required
            />
          </div>

          {mistake && (
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieData && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={transformMovieData(movieData)} />
        </div>
      )}
    </>
  );
};
