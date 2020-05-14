// eslint-disable-next-line
/// <reference types="react-scripts" />

interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

type FindMovieProps = {
  addMovie: (movie: Movie) => void;
  addingError: boolean;
};
