export interface Movie {
  title: string;
  description: string;
  imgUrl: string;
  imdbUrl: string;
  imdbId: string;
}

export interface MovieFromServer {
  Response: string;
  Title: string;
  Plot: string;
  Poster: string;
  imdbID: string;
}
