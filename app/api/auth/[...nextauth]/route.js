import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authAdapter } from "@/lib/db/auth-adapter";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: authAdapter,
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/register",
  },
  callbacks: {
    async session({ session, token, user }) {
      // Добавляем ID пользователя из базы данных в сессию
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
