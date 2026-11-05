import { useQuery } from "@tanstack/react-query";
import { client, orpc } from "../lib/api";

// Public list of active promotions for the Promociones tab.
export function usePromotions() {
  return useQuery(orpc.promotions.list.queryOptions());
}

// Admin list (every promotion). Only runs once a key has been entered.
export function useAdminPromotions(key: string) {
  return useQuery({
    queryKey: ["promotions", "admin", key],
    queryFn: () => client.promotions.adminList({ key }),
    enabled: key.length > 0,
    retry: false,
  });
}
