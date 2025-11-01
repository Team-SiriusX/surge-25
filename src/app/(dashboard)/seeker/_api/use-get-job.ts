import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.seeker.jobs)[":id"]["$get"]
>;

export const useGetJob = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEEKER_JOB, id],
    queryFn: async () => {
      if (!id) throw new Error("Job ID is required");

      const response = await client.api.seeker.jobs[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      return response.json();
    },
    enabled: !!id,
  });
};
