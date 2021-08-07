import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addMovies = (movie) => {
    const { movies } = this.state;

    if (!movie) {
      return;
    }

    const includesInList = movies.some(film => film.imdbId === movie.imdbId);

    if (!includesInList) {
      this.setState(state => ({
        movies: [...state.movies, movie],
      }));
    }
  }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie addMovie={this.addMovies} />
        </div>
      </div>
    );
  }
}
