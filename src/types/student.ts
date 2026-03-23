export interface Student {
  id: number;
  userId: number;
  firstname?: string;
  lastname?: string;
  dateofbirth: string;
  email: string;
  phone?: string;
  zipCode?: string;
  location?: string;
  school?: string;
  graduationyear?: number | null;
  jobinterests?: string;
  skills?: string;
  availability?: string;
  bio?: string;
  favoritejobads?: string;
  favoritecompanies?: string;
  gender?: string;
  username?: string;
}
