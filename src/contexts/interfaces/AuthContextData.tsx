import { Auth } from '../interfaces/auth';

export interface AuthContextData {
  auth: Auth;
  signIn: (code: string, password: string) => Promise<Auth>;
  signOut: () => Promise<void>;
  token: string;
  loading: boolean;
  printer: any;
}
