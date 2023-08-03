import { MovieObject } from './movie.model';

export interface User {
  displayName: string;
  email: string;
  emailVerified: boolean;
  watchList: MovieObject[];
}
