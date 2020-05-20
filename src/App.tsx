import React, { Component } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

import './App.scss';

interface State {
  movies: Movie[];
}

export class App extends Component <{}, State> {
  state = {
    movies: data,
  };

  addMovie = (movie: Movie) => {
    const filter = this.state.movies.every(item => item.imdbId !== movie.imdbId);

    if (filter) {
      this.setState(prevState => ({
        movies: [...prevState.movies, movie],
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
          <FindMovie addMovie={this.addMovie} movies={movies} />
        </div>
      </div>
    );
  }
}
