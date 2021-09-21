import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: data,
  };

  addMovie = (newMovie: Movie) => {
    const { movies } = this.state;
    let isAlreadyAdded = false;

    movies.forEach(movie => {
      if (movie.imdbId === newMovie.imdbId) {
        isAlreadyAdded = true;
      }
    });

    if (!isAlreadyAdded) {
      this.setState(currentState => ({
        movies: [...currentState.movies, newMovie],
      }));
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie onAdd={this.addMovie} />
        </div>
      </div>
    );
  }
}
