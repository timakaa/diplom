import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useUserBidForAuction(auctionId) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["userBid", auctionId, session?.user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/bids?auctionId=${auctionId}`);
      if (!response.ok) {
        throw new Error("Ошибка загрузки ставок");
      }
      const data = await response.json();
      // Возвращаем первую (последнюю по времени) ставку пользователя
      return data.bids && data.bids.length > 0 ? data.bids[0] : null;
    },
    enabled: !!session?.user && !!auctionId,
    staleTime: 30000, // 30 секунд кеш
    refetchOnWindowFocus: true,
  });
}
