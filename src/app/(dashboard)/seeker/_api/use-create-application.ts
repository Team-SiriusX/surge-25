import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.seeker.jobs)[":id"]["apply"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.seeker.jobs)[":id"]["apply"]["$post"]
>["json"];

export const useCreateApplication = (jobId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.seeker.jobs[":id"]["apply"].$post({
        param: { id: jobId },
        json,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit application");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEEKER_JOB, jobId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEEKER_APPLICATIONS] });
      toast.success("Application submitted successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit application");
    },
  });
};
