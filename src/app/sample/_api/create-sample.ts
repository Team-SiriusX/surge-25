import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/hono";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/constants/query-keys";

type ResponseType = InferResponseType<typeof client.api.sample.$post>;
type RequestType = InferRequestType<typeof client.api.sample.$post>["json"];

export const useCreateSample = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.sample.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create the sample");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SAMPLE] });
      toast.success("Sample created Successfully!");
    },
    onError: () => {
      toast.error("Failed to create the Sample");
    },
  });

  return mutation;
};
