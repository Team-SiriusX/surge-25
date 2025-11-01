import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { QUERY_KEYS } from "@/constants/query-keys";
import { client } from "@/lib/hono";
import { $Enums } from "@/generated/prisma";

type ResponseType = InferResponseType<typeof client.api.jobs.$get>;

type QueryParams = {
  type?: $Enums.JobType;
  category?: $Enums.JobCategory;
  status?: $Enums.PostStatus;
  location?: string;
  isDraft?: boolean;
  isFilled?: boolean;
  page?: number;
  limit?: number;
};

export const useGetJobs = (params?: QueryParams) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FINDER_JOBS, params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      
      if (params?.type) queryParams.type = params.type;
      if (params?.category) queryParams.category = params.category;
      if (params?.status) queryParams.status = params.status;
      if (params?.location) queryParams.location = params.location;
      if (params?.isDraft !== undefined) queryParams.isDraft = String(params.isDraft);
      if (params?.isFilled !== undefined) queryParams.isFilled = String(params.isFilled);
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);

      const response = await client.api.jobs.$get({
        query: queryParams,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      return response.json();
    },
  });

  return query;
};
