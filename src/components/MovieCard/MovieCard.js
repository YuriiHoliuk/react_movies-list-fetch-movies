import React from 'react';
import './MovieCard.scss';
import PropTypes from 'prop-types';

export const MovieCard = ({
  Title,
  Plot,
  Poster,
  imdbID,
}) => (
  <div className="card">
    <div className="card-image">
      <figure className="image is-4by3">
        <img
          src={Poster}
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
          <p className="title is-8">{Title}</p>
        </div>
      </div>

      <div className="content">
        {Plot}
        <br />
        <a href={imdbID}>IMDB</a>
      </div>
    </div>
  </div>
);

MovieCard.propTypes = {
  Title: PropTypes.string,
  Plot: PropTypes.string,
  Poster: PropTypes.string,
  imdbID: PropTypes.string,
};

MovieCard.defaultProps = {
  Title: 'title',
  Plot: 'description',
  Poster: 'imageUrl',
  imdbID: 'id',
};
