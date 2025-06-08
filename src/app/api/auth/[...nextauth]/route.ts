import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      // On initial sign in, persist the role into the JWT
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // Make sure session.user has id & role
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
};

// NextAuth requires at least one provider to be specified in the `providers` array.
// If you don't want to provide any providers, NextAuth will throw an error.
// You must have at least one authentication provider configured for NextAuth to work.
export default NextAuth(authOptions);
