import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { QUERY_KEYS } from "@/constants/query-keys";
import { InferResponseType } from "hono";

export type DashboardStatsResponse = InferResponseType<
  typeof client.api.finder.dashboard.stats.$get
>;

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FINDER_DASHBOARD_STATS],
    queryFn: async () => {
      const response = await client.api.finder.dashboard.stats.$get();
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      return response.json();
    },
  });
};
