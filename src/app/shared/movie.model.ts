export interface Movie {
  poster_path: string;
  id: string;
  original_title: string;
  release_date: string;
  vote_average: string;
}

export interface Response {
  page: number;
  results: Array<MovieObject>;
  total_pages: number;
  total_results: number;
}

export interface RefinedResponse {
  movies: Array<MovieObject>;
  moviePosterPaths: string[];
  movieIds: number[];
  movieRatings: number[];
  movieNames?: string[];
  movieType?: string;
}

export interface MovieObject {
  adult?: boolean;
  backdrop_path: string;
  genre_ids?: any;
  id: number;
  media_type?: string;
  original_language?: string;
  original_title: string;
  overview: string;
  popularity?: number;
  poster_path: string;
  release_date: string;
  title?: string;
  video?: boolean;
  vote_average: number;
  vote_count?: number;
  belongs_to_collection?: any;
  budget?: number;
  credits?: any;
  genres?: any;
  homepage?: string;
  imdb_id?: string;
  production_companies?: any;
  production_countries?: any;
  revenue?: number;
  runtime?: number;
  spoken_languages?: any;
  status?: string;
  tagline?: string;
  casts?: Array<Object>;
  liked?: boolean;
}
