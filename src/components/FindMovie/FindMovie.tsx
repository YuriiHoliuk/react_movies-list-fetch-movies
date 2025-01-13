import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [errors, setErrors] = useState(false);
  const [inputText, setInputText] = useState('');
  const [findedFilm, setFindedFilm] = useState<Movie | null>(null);
  const [fisrtSearch, setFirstSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <form className="find-movie">
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
              className={classNames('input', {
                'is-danger': errors,
              })}
              value={inputText}
              onChange={event => {
                setInputText(event.target.value);
                setErrors(false);
              }}
            />
          </div>

          {errors && (
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
              disabled={inputText === ''}
              onClick={event => {
                event.preventDefault();
                setLoading(true);
                setFirstSearch(true);
                getMovie(inputText)
                  .then(currentMovie => {
                    if (
                      'Response' in currentMovie &&
                      currentMovie.Response === 'False'
                    ) {
                      throw new Error(currentMovie.Error);
                    }

                    const movie = {
                      title: currentMovie.Title,
                      description: currentMovie.Plot,
                      imgUrl:
                        currentMovie.Poster !== 'N/A'
                          ? currentMovie.Poster
                          : '',
                      imdbUrl: `https://www.imdb.com/title/${currentMovie.imdbID}`,
                      imdbId: currentMovie.imdbID,
                    };

                    setFindedFilm(movie);
                    setErrors(false);
                    setLoading(false);
                  })
                  .catch(() => {
                    setErrors(true);
                    setLoading(false);
                  });
              }}
            >
              {fisrtSearch ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={inputText === ''}
              onClick={() => {
                if (
                  findedFilm &&
                  !movies.some(movie => movie.imdbId === findedFilm.imdbId)
                ) {
                  setMovies([...movies, findedFilm]);
                  setInputText('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {findedFilm && <MovieCard movie={findedFilm} />}
      </div>
    </>
  );
};
