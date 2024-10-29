import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, name, email, phone, country, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création du nouvel utilisateur
    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        email,
        phone,
        country,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
