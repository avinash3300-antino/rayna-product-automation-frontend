export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    list: (params: Record<string, unknown>) =>
      ["users", "list", params] as const,
    detail: (id: string) => ["users", "detail", id] as const,
  },
  sessions: {
    all: ["sessions"] as const,
  },
  profile: {
    activity: (params: Record<string, unknown>) =>
      ["profile", "activity", params] as const,
  },
  destinations: {
    all: ["destinations"] as const,
    list: (params: Record<string, unknown>) =>
      ["destinations", "list", params] as const,
    detail: (id: string) => ["destinations", "detail", id] as const,
  },
};
