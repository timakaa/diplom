import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
<<<<<<< Updated upstream
import { authAdapter } from "@/lib/db/auth-adapter";
=======
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
>>>>>>> Stashed changes

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
<<<<<<< Updated upstream
  adapter: authAdapter,
=======
  adapter: DrizzleAdapter(db),
>>>>>>> Stashed changes
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin || false;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
