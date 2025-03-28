"use client";

import { useQuery } from "@tanstack/react-query";

export function useAuctions({ page = 1, limit = 9, status } = {}) {
  return useQuery({
    queryKey: ["auctions", page, limit, status],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
      });

      const response = await fetch(`/api/auctions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
      return response.json();
    },
  });
}

export function useAuction(id) {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      const response = await fetch(`/api/auctions/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auction");
      }
      return response.json();
    },
    enabled: !!id,
  });
}
