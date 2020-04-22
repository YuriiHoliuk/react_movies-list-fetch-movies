import React, {
  FC, useState, ChangeEvent, FormEvent,
} from 'react';
import './FindMovie.scss';
import className from 'classnames';
import { IMDB_URL, getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setError(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!movie) {
      return;
    }

    setQuery('');
    addMovie(movie);
    setMovie(null);
  };

  const handleFindMovie = () => {
    getMovie(query)
      .then(findMovie => {
        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbId,
          Response,
        } = findMovie;

        if (Response === 'True') {
          const imdbUrl = IMDB_URL + imdbId;
          const newMovie = {
            title,
            description,
            imgUrl,
            imdbId,
            imdbUrl,
          };

          setMovie(newMovie);
        } else {
          setMovie(null);
          setError(true);
        }
      });
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={className('input', { 'is-danger': isError })}
              value={query}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            {isError ? 'Can\'t find a movie with such a title' : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={handleFindMovie}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie ? <MovieCard {...movie} /> : ''}
      </div>
    </>
  );
};
