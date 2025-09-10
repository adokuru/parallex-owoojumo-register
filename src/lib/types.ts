export interface Region {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  name: string;
}

export interface Bank {
  id: string;
  bank_name: string;
}

export interface RegistrationFormData {
  firstName: string;
  surname: string;
  phone: string;
  email?: string;
  nin: string;
  bvn: string;
  address: string;
  region_id: string;
  zone_id: string;
  bank_id: string;
  account_number: string;
  parallex_id: string;
  account_name?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface AccountValidationResponse {
  account_name: string;
}

export interface RegistrationResponse {
  authtoken?: string;
  [key: string]: unknown;
}
