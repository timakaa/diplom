"use client";

import { useQuery } from "@tanstack/react-query";

export function useAuctions({
  page = 1,
  limit = 9,
  status = null,
  priceMin = "",
  priceMax = "",
  yearMin = "",
  yearMax = "",
} = {}) {
  return useQuery({
    queryKey: [
      "auctions",
      page,
      limit,
      status,
      priceMin,
      priceMax,
      yearMin,
      yearMax,
    ],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) {
        params.append("status", status);
      }

      if (priceMin) {
        params.append("priceMin", priceMin);
      }

      if (priceMax) {
        params.append("priceMax", priceMax);
      }

      if (yearMin) {
        params.append("yearMin", yearMin);
      }

      if (yearMax) {
        params.append("yearMax", yearMax);
      }

      const response = await fetch(`/api/auctions?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
      return response.json();
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
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
