import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { QUERY_KEYS } from "@/constants/query-keys";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.jobs)[":id"]["$get"]
>;

export const useGetJob = (id?: string) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FINDER_JOB, id],
    queryFn: async () => {
      if (!id) throw new Error("Job ID is required");

      const response = await client.api.jobs[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      return response.json();
    },
    enabled: !!id,
  });

  return query;
};
