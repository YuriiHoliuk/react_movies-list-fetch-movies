import { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
// import { loadMovie } from './api/api';

interface State {
  movies: Movie[];
}

export class App extends Component<{}, State> {
  state: State = {
    movies: data,
  };

  // async componentDidMount() {
  //   const data = await loadMovie('');

  //   this.setState({ todos: data });
  // }

  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    );
  }
}
