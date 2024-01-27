import React from 'react';
import './MovieCard.scss';
import { MovieData } from '../../types/MovieData';

type Props = {
  movie: MovieData
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  if (!movie) {
    return null;
  }

  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={
              (movie.Poster !== 'N/A')
                ? movie.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview'
            }
            alt="Film logo"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img
                src="images/imdb-logo.jpeg"
                alt="imdb"
              />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">{movie.Title}</p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movie.Plot}
          <br />
          <a href={`https://www.imdb.com/title/${movie.imdbID}`} data-cy="movieURL">
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
};
