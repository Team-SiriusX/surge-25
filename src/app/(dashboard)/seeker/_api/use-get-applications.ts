import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  typeof client.api.seeker.applications.$get
>;

type QueryParams = {
  status?: string;
  jobPostId?: string;
  page?: string;
  limit?: string;
};

export const useGetApplications = (params?: QueryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEEKER_APPLICATIONS, params],
    queryFn: async () => {
      const response = await client.api.seeker.applications.$get({
        query: params as any,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      return response.json();
    },
  });
};
