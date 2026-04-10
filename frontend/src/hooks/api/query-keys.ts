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
  discovery: {
    all: ["discovery"] as const,
    runs: (params: Record<string, unknown>) =>
      ["discovery", "runs", params] as const,
    run: (id: string) => ["discovery", "run", id] as const,
    sources: (runId: string) => ["discovery", "sources", runId] as const,
  },
  scraping: {
    all: ["scraping"] as const,
    jobs: (params: Record<string, unknown>) =>
      ["scraping", "jobs", params] as const,
    job: (id: string) => ["scraping", "job", id] as const,
  },
  activities: {
    all: ["activities"] as const,
    list: (params: Record<string, unknown>) =>
      ["activities", "list", params] as const,
    detail: (id: string) => ["activities", "detail", id] as const,
  },
};
