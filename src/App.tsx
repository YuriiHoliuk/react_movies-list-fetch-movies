import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isMovieFind, setIsMovieFind] = useState(true);
  const [isError, setIsError] = useState(false);

  const changeTitle = (event:React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
    setIsError(false);
  };

  const findMovie = (event:React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsMovieFind(false);

    getMovie(newTitle)
      .then(res => {
        if ('Error' in res) {
          setNewMovie(null);
          setIsMovieFind(true);
          setIsError(true);
        } else {
          setNewMovie({
            title: newTitle,
            description: res.Plot,
            imgUrl: res.Poster,
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}/`,
            imdbId: res.imdbID,
          });
          setIsMovieFind(true);
        }
      })
      .finally(() => {
        setIsMovieFind(true);
      });
  };

  const addMovie = () => {
    if (newMovie) {
      const isExist = movies.some(movie => movie.imdbId === newMovie.imdbId);

      if (!isExist) {
        setMovies(oldMovies => ([
          ...oldMovies,
          newMovie,
        ]));
      }

      setNewTitle('');
      setNewMovie(null);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          findMovie={findMovie}
          newTitle={newTitle}
          changeTitle={changeTitle}
          newMovie={newMovie}
          addMovie={addMovie}
          isMovieFind={isMovieFind}
          isError={isError}
        />
      </div>
    </div>
  );
};
