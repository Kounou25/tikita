import { promises as fs } from 'fs';
import path from 'path';

export async function GET(req, res) {
  const filePath = path.join(process.cwd(), 'visits.json');

  try {
    // Lire le fichier visits.json
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Incrémenter le nombre de visites
    jsonData.visits += 1;

    // Sauvegarder le nouveau nombre de visites
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));

    // Retourner le nombre de visites mis à jour
    return new Response(JSON.stringify({ visits: jsonData.visits }), {
      status: 200,
    });
  } catch (error) {
    console.error('Erreur de gestion des visites:', error);
    return new Response(JSON.stringify({ error: 'Erreur du serveur' }), {
      status: 500,
    });
  }
}
