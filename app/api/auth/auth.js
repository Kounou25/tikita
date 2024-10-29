import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Chercher l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
        });

        // Si l'utilisateur n'existe pas ou que le mot de passe est incorrect
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid username or password");
        }

        // Si tout est correct, renvoyer l'utilisateur
        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Page d'inscription personnalisée
  },
  session: {
    jwt: true, // Utilisation de JSON Web Tokens
  },
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.id = token.id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
