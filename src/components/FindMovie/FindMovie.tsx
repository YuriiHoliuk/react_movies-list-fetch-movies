import { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

async function getMovie(title: string): Promise<Movie> {
  const res = await fetch(`https://www.omdbapi.com/?apikey=f151d5b2&t=${title}`);

  return res.json();
}

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieWasFound, setMovieFound] = useState(true);

  const handleTittleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setMovieFound(true);
  };

  const foundMovie = async (titleNew: string) => {
    if (title) {
      const movieFromServer = await getMovie(titleNew);

      if (movieFromServer.Title) {
        setMovie(movieFromServer);
        setMovieFound(true);
      } else {
        setMovieFound(false);
      }
    }
  };

  const addNewMovie = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
                value={title}
                onChange={handleTittleChange}
              />
            </div>
          </label>

          {!movieWasFound && (
            <p className="help is-danger"> Can&apos;t find a movie with such a title</p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => foundMovie(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
