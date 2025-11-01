import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<typeof client.api.finder.jobs.$post>;
type RequestType = InferRequestType<typeof client.api.finder.jobs.$post>["json"];

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.finder.jobs.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create job post");
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINDER_JOBS] });
      toast.success(data.message || "Job post created successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create job post");
    },
  });

  return mutation;
};
