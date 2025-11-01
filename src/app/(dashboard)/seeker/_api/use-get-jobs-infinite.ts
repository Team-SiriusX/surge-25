import { useInfiniteQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<typeof client.api.seeker.jobs.$get>;

type QueryParams = {
  q?: string;
  type?: string;
  category?: string;
  location?: string;
  tags?: string;
  minMatchScore?: string;
  sortBy?: "matchScore" | "createdAt" | "views" | "relevance";
  limit?: string;
};

export const useGetJobsInfinite = (params?: QueryParams) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SEEKER_JOBS, "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await client.api.seeker.jobs.$get({
        query: {
          ...params,
          page: String(pageParam),
        } as any,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
    getNextPageParam: (lastPage: any) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
