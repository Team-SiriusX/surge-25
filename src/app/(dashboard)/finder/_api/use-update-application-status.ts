import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.finder.applications)[":id"]["status"]["$patch"]
>;
type RequestType = InferRequestType<
  (typeof client.api.finder.applications)[":id"]["status"]["$patch"]
>["json"];

export const useUpdateApplicationStatus = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.finder.applications[":id"]["status"].$patch({
        param: { id },
        json,
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FINDER_APPLICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FINDER_APPLICATION, id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FINDER_DASHBOARD_STATS],
      });
      toast.success(data.message || "Application status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update application status");
    },
  });

  return mutation;
};
