import React,
{
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';

import './FindMovie.scss';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { API_URL, getData } from '../../api/getData';

interface Props {
  addMovie(movie: Movie): void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsError(false);
  };

  const handleFind = async () => {
    const getNewMovie = () => {
      return getData(`${API_URL}${searchQuery}`);
    };

    const newMovieFromServer = await getNewMovie();

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response,
    } = newMovieFromServer;

    if (Response === 'True') {
      const imdbUrl = `${API_URL}${imdbId}`;
      const movie = {
        title,
        description,
        imgUrl,
        imdbId,
        imdbUrl,
      };

      setNewMovie(movie);
    } else {
      setIsError(true);
      setNewMovie(null);
    }
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (newMovie) {
      setSearchQuery('');
      setIsError(false);
      addMovie(newMovie);
      setNewMovie(null);
    }
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={cn('input', isError ? 'is-danger' : '')}
              value={searchQuery}
              onChange={handleChange}
            />
          </div>
          {isError
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={handleFind}
              className="button is-light"
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
        {newMovie ? <MovieCard {...newMovie} /> : ''}
      </div>
    </>
  );
};
