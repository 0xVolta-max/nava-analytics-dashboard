import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  return null; // This component will not render anything as it redirects immediately
}