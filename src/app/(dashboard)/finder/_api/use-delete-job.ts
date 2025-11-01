import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.jobs)[":id"]["$delete"]
>;

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, string>({
    mutationFn: async (id) => {
      const response = await client.api.jobs[":id"].$delete({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to delete job post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINDER_JOBS] });
      toast.success(data.message || "Job post deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete job post");
    },
  });

  return mutation;
};
