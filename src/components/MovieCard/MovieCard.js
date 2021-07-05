import React from 'react';
import './MovieCard.scss';
import PropTypes from 'prop-types';

export const MovieCard = React.memo(({
  Title,
  Description,
  Poster,
  imdbID,
  Year,
  imdbRating,
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
          <p className="title is-8">
            {Title}
          </p>
          <span>
            {`(${Year}) Rating: ${imdbRating}`}
          </span>
        </div>
      </div>

      <div className="content">
        {Description}
        <br />
        <a href={`https://www.imdb.com/title/${imdbID}/`}>IMDB</a>
      </div>
    </div>
  </div>
));

MovieCard.propTypes = {
  Title: PropTypes.string,
  Description: PropTypes.string,
  Poster: PropTypes.string,
  imdbID: PropTypes.string,
  Year: PropTypes.string,
  imdbRating: PropTypes.string,
};

MovieCard.defaultProps = {
  Title: '',
  Description: '',
  Poster: '',
  imdbID: '',
  Year: '',
  imdbRating: '',
};
