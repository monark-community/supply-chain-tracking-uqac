// page.tsx côté serveur
import { redirect } from "next/navigation";

export default async function Page() {
  // Ici on fait juste la redirection côté serveur si pas connecté
  // Mais comme on utilise Auth0 client, on peut juste rendre le composant client
  return import("./_client").then(mod => <mod.default />);
}
