import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";
import type { NextAuthOptions } from "next-auth";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // ❌ user tidak ada atau sudah disable
        if (!user || !user.active) {
          return null;
        }

        const valid = await comparePassword(
          credentials.password,
          user.password
        );

        if (!valid) {
          return null;
        }

        // ✅ RETURN HARUS SESUAI type next-auth.d.ts
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          forcePasswordChange: user.forcePasswordChange,
        };
      },
    }),
  ],

  callbacks: {
    /**
     * JWT
     * - Jalan di login
     * - Jalan di setiap request
     */
    async jwt({ token, user }) {
      // 🔐 First login
      if (user) {
        token.id = user.id;
        token.role = user.role as Role;
        token.active = user.active;
        token.forcePasswordChange = user.forcePasswordChange;
        return token;
      }

      // 🔄 Refresh active status (ADMIN disable user)
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: {
            active: true,
            role: true,
            forcePasswordChange: true,
          },
        });

        if (!dbUser) {
          token.active = false;
        } else {
          token.active = dbUser.active;
          token.role = dbUser.role;
          token.forcePasswordChange = dbUser.forcePasswordChange;
        }
      }

      return token;
    },

    /**
     * SESSION
     * - Dipakai frontend
     */
    async session({ session, token }) {
      if (!session.user || !token.id) {
        return session;
      }

      session.user.id = token.id;
      session.user.role = token.role as Role;
      session.user.active = token.active as boolean;
      session.user.forcePasswordChange =
        token.forcePasswordChange as boolean;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
