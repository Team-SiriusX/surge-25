import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  typeof client.api.seeker.jobs.saved.list.$get
>;

export const useGetSavedJobs = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEEKER_SAVED_JOBS],
    queryFn: async () => {
      const response = await client.api.seeker.jobs.saved.list.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch saved jobs");
      }

      return response.json();
    },
  });
};
