"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AuctionImage from "./AuctionImage";
import AuctionHeader from "./AuctionHeader";
import AuctionSpecs from "./AuctionSpecs";
import AuctionDescription from "./AuctionDescription";
import AuctionBidPanel from "./AuctionBidPanel";

const fetchAuction = async (id) => {
  const response = await fetch(`/api/auctions/${id}`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки аукциона");
  }
  return response.json();
};

export const getTimeLeft = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;

  if (diff <= 0) {
    return "Аукцион завершен";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} д. ${hours} ч.`;
  } else if (hours > 0) {
    return `${hours} ч. ${minutes} мин.`;
  } else {
    return `${minutes} мин.`;
  }
};

export default function AuctionDetails({ id }) {
  const [timeLeft, setTimeLeft] = useState("");
  const { toast } = useToast();
  const { data: session, update: updateSession } = useSession();
  const { addToFavorites, removeFromFavorites } = useFavorites();
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: auction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => fetchAuction(id),
  });

  // Проверяем, находится ли аукцион в избранном
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites", session?.user?.id],
    queryFn: async () => {
      const response = await fetch("/api/favorites");
      if (!response.ok) throw new Error("Ошибка загрузки избранного");
      return response.json();
    },
    enabled: !!session?.user,
    staleTime: 0,
    refetchOnMount: true,
  });

  const isFavorite = favorites?.favorites?.some(
    (fav) => fav.auction.id === parseInt(id),
  );

  const handleFavoriteClick = () => {
    if (!session?.user) {
      toast({
        title: "Необходима авторизация",
        description: "Войдите, чтобы добавить аукцион в избранное",
        variant: "destructive",
      });
      return;
    }

    if (isFavorite) {
      removeFromFavorites.mutate(parseInt(id));
    } else {
      addToFavorites.mutate(parseInt(id));
    }
  };

  useEffect(() => {
    if (auction?.endDate) {
      // Обновляем время каждую минуту
      const timer = setInterval(() => {
        setTimeLeft(getTimeLeft(auction.endDate));
      }, 60000);

      // Инициализируем сразу
      setTimeLeft(getTimeLeft(auction.endDate));

      return () => clearInterval(timer);
    }
  }, [auction?.endDate]);

  const handleBidSubmit = async (amount, isConfirmed = false) => {
    // Проверка авторизации
    if (!session?.user) {
      toast({
        title: "Необходима авторизация",
        description: "Войдите, чтобы сделать ставку",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return false;
    }

    // Валидация без отправки на сервер (для первого шага - проверки перед модальным окном)
    if (!isConfirmed) {
      if (!amount || isNaN(amount) || amount <= 0) {
        toast({
          title: "Ошибка",
          description: "Введите корректную сумму ставки",
          variant: "destructive",
        });
        return false;
      }

      if (amount <= auction.currentPrice) {
        toast({
          title: "Ошибка",
          description: "Ставка должна быть больше текущей цены",
          variant: "destructive",
        });
        return false;
      }

      // Проверка минимального шага ставки
      const minBid = Math.floor(parseInt(auction.currentPrice) + 1000);
      if (amount < minBid) {
        toast({
          title: "Ошибка",
          description: `Минимальный шаг ставки составляет 1 000 ₽. Минимальная ставка: ${new Intl.NumberFormat(
            "ru-RU",
            {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            },
          ).format(minBid)} ₽`,
          variant: "destructive",
        });
        return false;
      }

      // Валидация пройдена
      return true;
    }

    // Если подтверждено, отправляем на сервер
    try {
      const response = await fetch("/api/bids", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId: parseInt(id),
          amount: Math.floor(parseInt(amount)), // Округляем до целого числа
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Ошибка при создании ставки");
      }

      const data = await response.json();

      // Обновляем данные аукциона в кэше
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      // Также обновляем данные о ставках пользователя
      queryClient.invalidateQueries({ queryKey: ["bids"] });
      // Обновляем данные о ставке пользователя для этого аукциона
      queryClient.invalidateQueries({
        queryKey: ["userBid", parseInt(id), session?.user?.id],
      });

      // Обновляем баланс пользователя в сессии
      if (session?.user) {
        const currentBalance = parseInt(session.user.balance || 0);
        const newBalance = currentBalance - Math.floor(parseInt(amount));

        // Обновляем сессию с новым балансом
        await updateSession({
          user: {
            ...session.user,
            balance: newBalance,
          },
        });
      }

      toast({
        title: "Успешно",
        description: "Ваша ставка принята",
      });

      return true;
    } catch (error) {
      toast({
        title: "Ошибка",
        description:
          error.message || "Не удалось сделать ставку. Попробуйте позже.",
        variant: "destructive",
      });
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className='container px-4 py-8'>
        <div className='flex flex-col items-center justify-center p-8 space-y-4'>
          <LoadingSpinner size='xl' />
          <p className='text-muted-foreground'>
            Загрузка информации об аукционе...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container px-4 py-8'>
        <div className='text-center text-red-500 p-8 border border-red-200 rounded-md bg-red-50'>
          <h3 className='text-xl font-semibold mb-2'>
            Ошибка загрузки аукциона
          </h3>
          <p>
            {error.message || "Не удалось загрузить данные. Попробуйте позже."}
          </p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className='container px-4 py-8'>
        <div className='text-center p-8 border border-gray-200 rounded-md'>
          <h3 className='text-xl font-semibold mb-2'>Аукцион не найден</h3>
          <p className='text-muted-foreground'>
            Запрашиваемый аукцион не существует или был удалён
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='container px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Основная информация */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Галерея изображений */}
          <AuctionImage title={auction.title} />

          {/* Информация об автомобиле */}
          <div className='space-y-6'>
            <AuctionHeader
              auction={auction}
              isFavorite={isFavorite}
              isLoadingFavorites={isLoadingFavorites}
              onFavoriteClick={handleFavoriteClick}
              addToFavoritesPending={addToFavorites.isPending}
              removeFromFavoritesPending={removeFromFavorites.isPending}
            />

            <AuctionSpecs auction={auction} />

            {/* Описание */}
            <AuctionDescription description={auction.description} />
          </div>
        </div>

        {/* Панель ставок */}
        <AuctionBidPanel
          auction={auction}
          timeLeft={timeLeft}
          onBidSubmit={handleBidSubmit}
        />
      </div>
    </div>
  );
}
