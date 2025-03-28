import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authAdapter } from "@/lib/db/auth-adapter";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const authOptions = {
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
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("JWT Callback:", { token, user, account });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log("Session Callback - User Data:", user);
      console.log("Session Callback - Current Session:", session);
      console.log("Session Callback - Token:", token);

      if (session?.user) {
        // Получаем полные данные пользователя из базы
        const dbUser = await db.query.users.findFirst({
          where: eq(users.id, token.id),
        });

        console.log("Session Callback - DB User:", dbUser);

        session.user.id = token.id;
        session.user.plan = dbUser?.plan;
        session.user.balance = dbUser?.balance;
      }

      console.log("Session Callback - Updated Session:", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
