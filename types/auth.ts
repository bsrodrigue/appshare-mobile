import { UserRole } from "./role";

export interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  promoCode: string;
  documentUri?: string;
  logoUri?: string;
  role?: string;
}

export interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  terms?: string;
  document?: string;
  logo?: string;
  role?: string;
}

export type AuthMode = 'login' | 'register';

export type UserResource = {
  id: number;
  email: string;
  phone: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  is_active: boolean;
  phone_verified_at: string;
  created_at: string;
}
