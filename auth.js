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
  // Only use adapter if it's available (not null during build time)
  ...(authAdapter && { adapter: authAdapter }),
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
      if (user) {
        token.id = user.id;

        // Only try to access database if it's available
        if (db) {
          try {
            // Get user permissions from database
            const dbUser = await db.query.users.findFirst({
              where: eq(users.id, user.id),
            });

            // Explicitly set isAdmin as boolean
            token.isAdmin = dbUser?.isAdmin === true;
          } catch (error) {
            console.error("Error in JWT callback:", error);
          }
        }
      }

      // When updating session, also check isAdmin value
      if (trigger === "update" && token?.id && db) {
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
      if (session?.user && db) {
        try {
          // Get full user data from database
          const dbUser = await db.query.users.findFirst({
            where: eq(users.id, token.id),
          });

          session.user.id = token.id;
          session.user.plan = dbUser?.plan;
          session.user.balance = dbUser?.balance;
          session.user.isAdmin = dbUser?.isAdmin === true;
        } catch (error) {
          console.error("Error in session callback:", error);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
