"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { createApiClient } from "@/services/api";

export function useApiClient() {
  const { data: session } = useSession();

  return useMemo(
    () => createApiClient(session?.accessToken),
    [session?.accessToken]
  );
}
