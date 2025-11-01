import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.seeker.applications)[":id"]["$get"]
>;

export const useGetApplication = (id?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEEKER_APPLICATION, id],
    queryFn: async () => {
      if (!id) throw new Error("Application ID is required");

      const response = await client.api.seeker.applications[":id"].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch application");
      }

      return response.json();
    },
    enabled: !!id,
  });
};
