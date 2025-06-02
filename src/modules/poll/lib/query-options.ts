import { queryOptions } from "@tanstack/react-query";

export const pollQueryOptions = {
  all: () => ["polls"] as const,
  lists: () => [...pollQueryOptions.all(), "list"] as const,
  list: (filters: Record<string, any>) =>
    [...pollQueryOptions.lists(), { filters }] as const,
  details: () => [...pollQueryOptions.all(), "detail"] as const,
  detail: (id: string) => [...pollQueryOptions.details(), id] as const,
};

export const getPollsQueryOptions = (filters?: Record<string, any>) =>
  queryOptions({
    queryKey: pollQueryOptions.list(filters || {}),
    queryFn: async () => {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [];
    },
  });

export const getPollQueryOptions = (id: string) =>
  queryOptions({
    queryKey: pollQueryOptions.detail(id),
    queryFn: async () => {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500));
      return null;
    },
  });
