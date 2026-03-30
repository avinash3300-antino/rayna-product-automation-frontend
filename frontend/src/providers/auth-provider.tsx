"use client";

import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function SessionGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (session?.error === "RefreshTokenError" && pathname !== "/login") {
      signIn();
    }
  }, [session?.error, pathname]);

  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGuard>{children}</SessionGuard>
    </SessionProvider>
  );
}
