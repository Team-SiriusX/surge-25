import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { QUERY_KEYS } from "@/constants/query-keys";
import { client } from "@/lib/hono";

type ResponseType = InferResponseType<
  (typeof client.api.finder.applications)[":id"]["$get"]
>;

export const useGetApplication = (id?: string) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FINDER_APPLICATION, id],
    queryFn: async () => {
      if (!id) throw new Error("Application ID is required");

      const response = await client.api.finder.applications[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch application");
      }

      return response.json();
    },
    enabled: !!id,
  });

  return query;
};
