import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<
  (typeof client.api.seeker.jobs)[":id"]["save"]["$post"]
>;

export const useSaveJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await client.api.seeker.jobs[":id"]["save"].$post({
        param: { id },
      });

      if (!response.ok) {
        throw new Error("Failed to save job");
      }

      return response.json();
    },
    onSuccess: (_, jobId) => {
      // Invalidate all job queries to refetch with updated hasSaved state
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.SEEKER_JOBS],
        refetchType: "active"
      });
      // Invalidate the specific job detail
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.SEEKER_JOB, jobId],
        refetchType: "active"
      });
      // Invalidate saved jobs list
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.SEEKER_SAVED_JOBS],
        refetchType: "active"
      });
      toast.success("Job saved successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save job");
    },
  });
};
