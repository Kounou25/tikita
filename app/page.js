import { redirect } from 'next/navigation';

export default function Home() {
  redirect('signup'); // Rediriger vers la page d'inscription
  return null; // La page d'accueil ne s'affichera pas, la redirection est immédiate
}
