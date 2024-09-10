import React from 'react';
import { Movie } from '../../types/Movie';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

const DEFAULT_POSTER_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

// eslint-disable-next-line react/display-name
export const MovieCard: React.FC<Props> = React.memo(({ movie }) => {
  return (
    <div className="card" data-cy="movieCard">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            data-cy="moviePoster"
            src={movie.imgUrl === 'N/A' ? DEFAULT_POSTER_URL : movie.imgUrl}
            alt="Film logo"
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <img src="images/imdb-logo.jpeg" alt="imdb" />
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8" data-cy="movieTitle">
              {movie.title}
            </p>
          </div>
        </div>

        <div className="content" data-cy="movieDescription">
          {movie.description}
          <br />
          <a
            href={`https://www.imdb.com/title/${movie.imdbUrl}`}
            data-cy="movieURL"
          >
            IMDB
          </a>
        </div>
      </div>
    </div>
  );
});
