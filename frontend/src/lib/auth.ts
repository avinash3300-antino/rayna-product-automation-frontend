import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import type { BackendLoginResponse } from "@/types/api-responses";
import type { UserRole, UserStatus } from "@/types/users";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Refresh 5 minutes before expiry
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
// Assume 30-minute token lifetime (adjust based on backend config)
const TOKEN_LIFETIME_MS = 30 * 60 * 1000;

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token.accessToken }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data: BackendLoginResponse = await res.json();

    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpiresAt: Date.now() + TOKEN_LIFETIME_MS,
      fullName: data.user.full_name,
      roles: data.user.roles as UserRole[],
      status: data.user.status as UserStatus,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshTokenError" };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data: BackendLoginResponse = await res.json();

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.full_name,
            accessToken: data.access_token,
            roles: data.user.roles,
            status: data.user.status,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.fullName = user.name!;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = Date.now() + TOKEN_LIFETIME_MS;
        token.roles = user.roles as UserRole[];
        token.status = user.status as UserStatus;
        return token;
      }

      // Token still valid
      if (Date.now() < token.accessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS) {
        return token;
      }

      // Refresh needed
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        fullName: token.fullName,
        name: token.fullName,
        roles: token.roles,
        status: token.status,
      };
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
