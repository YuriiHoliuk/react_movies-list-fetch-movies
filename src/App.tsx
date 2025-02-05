import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';
import { movieDataToMovie } from './types/MovieDataToMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [error, setError] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError(false);
  }, [searchTerm]);

  const handleSearchSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(false);

    if (!searchTerm) {
      setIsLoading(false);

      return;
    }

    getMovie(searchTerm)
      .then(innitMovie => {
        if (!innitMovie || 'Error' in innitMovie) {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie(movieDataToMovie(innitMovie));
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitAddToList = () => {
    if (!movie) {
      return;
    }

    setMovieList(prevList => {
      if (prevList.some(prevMovie => prevMovie.imdbId === movie.imdbId)) {
        return prevList;
      }

      return [...prevList, movie];
    });
    setSearchTerm('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movieList={movieList} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          error={error}
          isLoading={isLoading}
          searchTerm={searchTerm}
          handleSearchSet={handleSearchSet}
          handleSubmit={handleSubmitSearch}
          handleSubmitAddToList={handleSubmitAddToList}
        />
      </div>
    </div>
  );
};
