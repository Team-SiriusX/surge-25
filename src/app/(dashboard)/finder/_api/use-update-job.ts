import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.jobs)[":id"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.jobs)[":id"]["$patch"]
>["json"];

export const useUpdateJob = (id: string) => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.jobs[":id"].$patch({
        param: { id },
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update job post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINDER_JOBS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINDER_JOB, id] });
      toast.success(data.message || "Job post updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update job post");
    },
  });

  return mutation;
};
