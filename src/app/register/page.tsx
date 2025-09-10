import RegistrationForm from '@/components/RegistrationForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register - Owoojumo Web Register',
  description: 'Create a new account with Owoojumo',
};

export default function RegisterPage() {
  return <RegistrationForm />;
}
