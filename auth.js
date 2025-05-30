import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authAdapter } from "@/lib/db/auth-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: authAdapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      console.log("JWT Callback:", { token, user, account, trigger });

      if (user) {
        token.id = user.id;

        try {
          // Получаем информацию о правах пользователя из базы данных
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, user.id),
          });

          console.log("DB User in JWT callback:", dbUser);

          // Явно устанавливаем isAdmin как boolean
          token.isAdmin = dbUser?.isAdmin === true;

          console.log("Token after setting isAdmin:", token);
        } catch (error) {
          console.error("Error in JWT callback:", error);
        }
      }

      // При обновлении сессии также проверяем значение isAdmin
      if (trigger === "update" && token?.id) {
        try {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id),
          });

          if (dbUser) {
            token.isAdmin = dbUser.isAdmin === true;
          }
        } catch (error) {
          console.error("Error in JWT update callback:", error);
        }
      }

      return token;
    },
    async session({ session, token, user }) {
      console.log("Session Callback:", { session, token, user });

      if (session?.user) {
        try {
          // Получаем полные данные пользователя из базы
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id),
          });

          console.log("DB User in session callback:", dbUser);

          session.user.id = token.id;
          session.user.plan = dbUser?.plan;
          session.user.balance = dbUser?.balance;
          session.user.isAdmin = dbUser?.isAdmin === true;

          console.log("Session after setting user data:", session);
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
