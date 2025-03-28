/**
 * Function to fetch all bids for a specific auction
 * @param {number} auctionId - The ID of the auction
 * @param {Object} options - Optional parameters
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {number} options.pageSize - Number of bids per page (default: 10)
 * @param {string} options.status - Filter by bid status (optional)
 * @returns {Promise} - Promise that resolves to an object containing bids and pagination info
 */
export async function getAllBidsForAuction(auctionId, options = {}) {
  const { page = 1, pageSize = 10, status = null } = options;

  try {
    // Construct query parameters
    const params = new URLSearchParams({
      auctionId: auctionId.toString(),
      page: page.toString(),
      pageSize: pageSize.toString(),
      getAllBids: "true", // Special flag to indicate we want all bids, not just user's bids
    });

    // Add status filter if provided
    if (status) {
      params.append("status", status);
    }

    // Make the API request
    const response = await fetch(`/api/bids/auction/${auctionId}?${params}`);

    if (!response.ok) {
      throw new Error("Failed to fetch bids for auction");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching bids for auction:", error);
    throw error;
  }
}
