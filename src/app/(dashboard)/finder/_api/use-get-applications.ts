import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { QUERY_KEYS } from "@/constants/query-keys";
import { client } from "@/lib/hono";
import { $Enums } from "@/generated/prisma";

type ResponseType = InferResponseType<
  typeof client.api.applications.$get
>;

type QueryParams = {
  status?: $Enums.ApplicationStatus;
  applicantId?: string;
  jobPostId?: string;
  minMatchScore?: number;
  maxMatchScore?: number;
  page?: number;
  limit?: number;
};

export const useGetApplications = (params?: QueryParams) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.FINDER_APPLICATIONS, params],
    queryFn: async () => {
      const queryParams: Record<string, string> = {};
      
      if (params?.status) queryParams.status = params.status;
      if (params?.applicantId) queryParams.applicantId = params.applicantId;
      if (params?.jobPostId) queryParams.jobPostId = params.jobPostId;
      if (params?.minMatchScore !== undefined) queryParams.minMatchScore = String(params.minMatchScore);
      if (params?.maxMatchScore !== undefined) queryParams.maxMatchScore = String(params.maxMatchScore);
      if (params?.page) queryParams.page = String(params.page);
      if (params?.limit) queryParams.limit = String(params.limit);

      const response = await client.api.applications.$get({
        query: queryParams,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      return response.json();
    },
  });

  return query;
};
