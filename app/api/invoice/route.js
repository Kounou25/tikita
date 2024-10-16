import { NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { Buffer } from 'buffer';

// Fonction pour convertir une image en base64 depuis le système de fichiers
function loadImageAsBase64(filePath) {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString('base64')}`;
}

export async function POST(req) {
  try {
    const { customer, email, items } = await req.json();
    const total = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0);

    // Créer un nouveau document PDF avec une taille A5 (148mm x 210mm)
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

    // Chemin absolu vers le logo
    const logoPath = path.join(process.cwd(), 'app', 'images', 'kelly.jpeg');

    // Charger le logo en base64 depuis le disque
    const logoBase64 = loadImageAsBase64(logoPath);

    // Ajouter le logo en haut à droite
    doc.addImage(logoBase64, 'PNG', 80, 10, 65, 40); // Ajuste la position et la taille du logo

    // Définir des styles
    doc.setFont("helvetica");
    doc.setFontSize(22);
    doc.setTextColor(0, 102, 204); // Couleur du titre
    doc.text("Reçu", 15, 30);

    // Informations sur le client
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Couleur du texte
    doc.text(`Reçu de: ${customer}`, 15, 45);
    doc.text(`Numero de tel: ${email}`, 15, 52);

    // Dessiner une ligne de séparation
    doc.setDrawColor(0, 102, 204); // Couleur de la ligne
    doc.line(10, 58, 140, 58); // Ligne ajustée

    // Ajouter les en-têtes du tableau
    const tableStartY = 65;
    const rowHeight = 8;

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // Couleur du texte
    doc.setFillColor(0, 102, 204); // Couleur de fond pour les en-têtes
    doc.rect(10, tableStartY, 130, rowHeight, 'F'); // Fond pour les en-têtes

    // Ajuster les positions des colonnes
    doc.text("Description", 12, tableStartY + 6); // Colonne Description
    doc.text("Qty", 60, tableStartY + 6);        // Colonne Quantity (réduite)
    doc.text("Price (CFA)", 78, tableStartY + 6); // Colonne Price
    doc.text("Total (CFA)", 110, tableStartY + 6); // Colonne Total (avec plus d'espace)

    // Dessiner une ligne sous les en-têtes
    doc.setDrawColor(200, 200, 200);
    doc.line(10, tableStartY + rowHeight, 140, tableStartY + rowHeight); // Ligne ajustée

    // Ajouter les articles
    items.forEach((item, index) => {
      const description = item.description || '';
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const itemTotal = quantity * price;

      const yPosition = tableStartY + rowHeight * (index + 2);
      doc.setTextColor(0, 0, 0); // Couleur du texte pour les articles
      doc.text(description, 12, yPosition);
      doc.text(quantity.toString(), 60, yPosition);
      doc.text(`${price.toFixed(2)} CFA`, 78, yPosition);
      doc.text(`${itemTotal.toFixed(2)} CFA`, 110, yPosition); // Espacement ajusté
    });

    // Ajouter le total
    const totalYPosition = tableStartY + rowHeight * (items.length + 2);
    doc.setFontSize(12);
    doc.setTextColor(0, 102, 204); // Couleur du total
    doc.text(`Total: ${total.toFixed(2)} CFA`, 12, totalYPosition + 10);

    //Ajouter une ligne sous le total
    doc.setDrawColor(0, 122, 204);
    doc.line(10, totalYPosition + 15, 140, totalYPosition + 15);

    // Ajouter un message de remerciement centré en bas
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150); // Gris clair pour le message
    doc.text("Merci pour votre confiance!\ncakes by rk la meilleur !\n 00227 84 61 53 53", 75, totalYPosition + 25, { align: "center" });

    // Ajouter la date et l'heure d'émission du reçu en bas à droite
    const date = new Date().toLocaleDateString('fr-FR'); // Format de date français
    const time = new Date().toLocaleTimeString('fr-FR'); // Heure au format français
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Couleur du texte
    doc.text(`Date: ${date}`, 135, totalYPosition + 30, { align: "right" });
    doc.text(`Heure: ${time}`, 135, totalYPosition + 35, { align: "right" });

    // Récupérer les données du PDF sous forme de buffer
    const pdfData = doc.output('arraybuffer');

    return new NextResponse(Buffer.from(pdfData), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=invoice.pdf',
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du PDF :", error);
    return new NextResponse('Erreur lors de la génération du PDF', { status: 500 });
  }
}
