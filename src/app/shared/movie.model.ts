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
  title: string;
  video?: boolean;
  vote_average: number;
  vote_count?: number;
}
