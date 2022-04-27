import React from 'react';
import './MovieCard.scss';

type Props = {
  movie: Movie;
};

export const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <div className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
          />
        </figure>
      </div>
      <div className="card-content">
        <div className="media">
          <div className="media-left">
            <figure className="image is-48x48">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src="images/imdb-logo.jpeg"
                  alt="imdb"
                />
              </a>
            </figure>
          </div>
          <div className="media-content">
            <p className="title is-8">{movie.Title}</p>
          </div>
        </div>

        <div className="content">
          {movie.Plot}
          <br />
        </div>
      </div>
    </div>
  );
};
