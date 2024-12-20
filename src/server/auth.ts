import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import TwitterProvider from "next-auth/providers/twitter";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
  interface User {
    id: string;
  }
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async redirect({ url, baseUrl }) {
      return `/siita-raffle-v0`;
    },
    session: ({ session, user, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: user?.id ?? token?.sub ?? "unknown",
        accessToken: token?.accessToken,
      },
    }),
    jwt: ({ token, user, account }) => {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    TwitterProvider({
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access",
        },
      },
      profile(profile: {
        data: {
          profile_image_url: string | null | undefined;
          id: string;
          name: string;
        };
      }) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          email: null, // Twitter doesn't provide email by default
          image: profile.data.profile_image_url,
        };
      },
    }),
    ...(isDevelopment
      ? [
          CredentialsProvider({
            id: "dev",
            name: "Development",
            credentials: {},
            authorize: async () => {
              return {
                id: "dev-user2",
                name: "Dev User",
                email: "dev@example.com",
              };
            },
          }),
        ]
      : []),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt", // JWTベースのセッション
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
