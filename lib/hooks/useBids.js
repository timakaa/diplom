import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export function useBids(
  initialPage = 1,
  initialPageSize = 10,
  auctionId = null,
  status = null,
) {
  const { data: session, status: sessionStatus } = useSession();
  const [bids, setBids] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    pageSize: initialPageSize,
    totalPages: 0,
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Функция для загрузки ставок с определенной страницы
  const fetchBids = async (page = pagination.currentPage) => {
    if (sessionStatus !== "authenticated") return;

    setIsLoading(true);
    try {
      // Формируем URL с параметрами
      let url = `/api/bids?page=${page}&pageSize=${pagination.pageSize}`;
      if (auctionId) url += `&auctionId=${auctionId}`;
      if (status) url += `&status=${status}`;

      const response = await fetch(url);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка загрузки ставок");
      }

      const data = await response.json();

      // Обрабатываем даты и форматируем суммы
      const formattedBids = data.bids.map((bid) => ({
        ...bid,
        formattedDate: new Date(bid.createdAt).toLocaleDateString("ru-RU"),
        formattedTime: new Date(bid.createdAt).toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        formattedAmount: new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency: "RUB",
          maximumFractionDigits: 0,
        }).format(bid.amount),
      }));

      setBids(formattedBids);
      setPagination({
        ...pagination,
        currentPage: page,
        totalPages: data.pagination.totalPages,
        totalCount: data.pagination.totalCount,
      });
    } catch (error) {
      console.error("Error fetching bids:", error);
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Загружаем ставки при монтировании компонента или изменении сессии
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchBids(initialPage);
    }
  }, [sessionStatus, auctionId, status, initialPageSize]);

  // Функция для изменения страницы
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchBids(newPage);
  };

  return {
    bids,
    pagination,
    isLoading,
    changePage,
    refetch: () => fetchBids(pagination.currentPage),
  };
}
