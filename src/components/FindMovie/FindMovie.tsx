import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  movie: Movie | null;
  error: boolean;
  isLoading: boolean;
  searchTerm: string;
  handleSearchSet: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent) => void;
  handleSubmitAddToList: () => void;
}

export const FindMovie: React.FC<Props> = ({
  movie,
  error,
  isLoading,
  searchTerm,
  handleSearchSet,
  handleSubmit,
  handleSubmitAddToList,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={handleSearchSet}
              value={searchTerm}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
            />
          </div>

          {error ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : (
            ''
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-loading': isLoading,
                'is-light': !isLoading,
              })}
              disabled={!searchTerm}
            >
              Find a movie
            </button>
          </div>

          {searchTerm ? (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleSubmitAddToList}
              >
                Add to the list
              </button>
            </div>
          ) : (
            ''
          )}
        </div>
      </form>

      {movie ? (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      ) : (
        <p>No movie found</p>
      )}
    </>
  );
};
