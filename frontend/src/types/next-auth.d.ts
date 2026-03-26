import "next-auth";
import "next-auth/jwt";
import type { UserRole, UserStatus } from "./users";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    roles: string[];
    status: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      fullName: string;
      name: string;
      roles: UserRole[];
      status: UserStatus;
    };
    accessToken: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    fullName: string;
    roles: UserRole[];
    status: UserStatus;
    accessToken: string;
    accessTokenExpiresAt: number;
    error?: string;
  }
}
