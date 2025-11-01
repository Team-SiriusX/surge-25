import { useQuery } from "@tanstack/react-query";
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
  page?: string;
  limit?: string;
};

export const useGetJobs = (params?: QueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEEKER_JOBS, params],
    queryFn: async () => {
      const response = await client.api.seeker.jobs.$get({
        query: params as any,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
  });
};
