import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';
import { movieDataToMovie } from './types/MovieDataToMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSet = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm) {
      return;
    }

    getMovie(searchTerm).then(innitMovie => {
      if (!innitMovie || 'Error' in innitMovie) {
        return;
      }

      setMovie(movieDataToMovie(innitMovie));
    });
  };

  const handleSubmitAddToList = () => {
    if (!movie) {
      return;
    }

    setMovieList([...movieList, movie]);
    setSearchTerm('');
  };

  // eslint-disable-next-line no-console
  console.log('SearchTerm:', searchTerm);
  // eslint-disable-next-line no-console
  console.log('MovieList:', movieList);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movieList={movieList} />
      </div>

      <div className="sidebar">
        <FindMovie
          movie={movie}
          searchTerm={searchTerm}
          handleSearchSet={handleSearchSet}
          handleSubmit={handleSubmitSearch}
          handleSubmitAddToList={handleSubmitAddToList}
        />
      </div>
    </div>
  );
};
