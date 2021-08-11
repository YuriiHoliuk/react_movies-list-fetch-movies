import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
  };

  addToList = (foundMovie) => {
    const { movies } = this.state;

    if (foundMovie && !movies.find(
      movie => movie.imdbId === foundMovie.imdbId,
    )) {
      this.setState(state => ({
        movies: [...state.movies, foundMovie],
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
          <FindMovie addToList={this.addToList} />
        </div>
      </div>
    );
  }
}
