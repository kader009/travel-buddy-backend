export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface PostArgs {
  id?: string;
  title?: string;
  content?: string;
}

export interface PostIdArgs {
  id: string;
}
