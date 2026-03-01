export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
  profileImage?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
