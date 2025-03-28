import { useQuery } from "@tanstack/react-query";

/**
 * React hook to get all bids for a specific auction
 * @param {number} auctionId - ID of the auction
 * @param {Object} options - Options for pagination and filtering
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.pageSize - Number of bids per page (default: 10)
 * @param {string} options.status - Filter by bid status (optional)
 * @returns {Object} - Query result with bids data and pagination
 */
export function useAllBidsForAuction(auctionId, options = {}) {
  const { page = 1, pageSize = 10, status = null } = options;

  return useQuery({
    queryKey: ["auctionBids", auctionId, page, pageSize, status],
    queryFn: async () => {
      // Construct query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // Add status filter if provided
      if (status) {
        params.append("status", status);
      }

      // Make the API request
      const response = await fetch(`/api/bids/auction/${auctionId}?${params}`);

      if (!response.ok) {
        throw new Error("Ошибка загрузки ставок для аукциона");
      }

      return response.json();
    },
    // Only run the query if we have a valid auction ID
    enabled: !!auctionId,
    // Cache data for 30 seconds before refetching
    staleTime: 30000,
  });
}
