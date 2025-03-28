"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Clock, Users, Calendar, MapPin, Gauge, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/lib/hooks/useFavorites";
import { useSession } from "next-auth/react";

const fetchAuction = async (id) => {
  const response = await fetch(`/api/auctions/${id}`);
  if (!response.ok) {
    throw new Error("Ошибка загрузки аукциона");
  }
  return response.json();
};

const getTimeLeft = (endDate) => {
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
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const { toast } = useToast();
  const { data: session } = useSession();
  const { addToFavorites, removeFromFavorites } = useFavorites();

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

  console.log("Favorites data:", favorites); // Добавляем для отладки
  console.log("Current auction id:", id); // Добавляем для отладки

  const isFavorite = favorites?.favorites?.some(
    (fav) => fav.auction.id === parseInt(id),
  );

  console.log("Is favorite:", isFavorite); // Добавляем для отладки

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

  const handleBidSubmit = (e) => {
    e.preventDefault();
    const amount = Number(bidAmount);

    if (!amount || isNaN(amount)) {
      toast({
        title: "Ошибка",
        description: "Введите корректную сумму ставки",
        variant: "destructive",
      });
      return;
    }

    if (amount <= auction.currentPrice) {
      toast({
        title: "Ошибка",
        description: "Ставка должна быть больше текущей цены",
        variant: "destructive",
      });
      return;
    }

    // Здесь будет логика отправки ставки
    toast({
      title: "Успешно",
      description: "Ваша ставка принята",
    });
    setBidAmount("");
  };

  if (isLoading) {
    return (
      <div className='container px-4 py-8'>
        <div className='text-center'>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container px-4 py-8'>
        <div className='text-center text-red-500'>Ошибка загрузки аукциона</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className='container px-4 py-8'>
        <div className='text-center'>Аукцион не найден</div>
      </div>
    );
  }

  return (
    <div className='container px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Основная информация */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Галерея изображений */}
          <div className='aspect-[16/9] relative rounded-lg overflow-hidden'>
            <Image
              src='/placeholder.svg'
              alt={auction.title}
              fill
              className='object-cover'
            />
          </div>

          {/* Информация об автомобиле */}
          <div className='space-y-6'>
            <div className='flex justify-between items-start'>
              <div>
                <h1 className='text-3xl font-bold'>{auction.title}</h1>
                <p className='text-muted-foreground mt-2'>
                  {auction.description}
                </p>
              </div>
              <Button
                variant={isFavorite ? "default" : "outline"}
                size='icon'
                onClick={handleFavoriteClick}
                disabled={
                  addToFavorites.isPending ||
                  removeFromFavorites.isPending ||
                  isLoadingFavorites
                }
                className={`transition-all ${
                  isFavorite
                    ? "bg-primary hover:bg-primary/90"
                    : "hover:text-primary hover:border-primary"
                }`}
              >
                {isLoadingFavorites ? (
                  <span className='h-5 w-5 animate-pulse'>•</span>
                ) : (
                  <Heart
                    className={`h-5 w-5 transition-all ${
                      isFavorite
                        ? "fill-primary-foreground text-primary-foreground"
                        : "fill-none hover:fill-primary/20"
                    }`}
                  />
                )}
              </Button>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              <div className='flex items-center gap-2'>
                <Gauge className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Пробег</p>
                  <p className='font-medium'>
                    {auction.mileage?.toLocaleString()} км
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Год</p>
                  <p className='font-medium'>{auction.year}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Локация</p>
                  <p className='font-medium'>{auction.location}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Users className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>Ставок</p>
                  <p className='font-medium'>{auction.bids || 0}</p>
                </div>
              </div>
            </div>

            {/* Описание */}
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Описание</h2>
              <p className='text-muted-foreground whitespace-pre-wrap'>
                {auction.description}
              </p>
            </div>
          </div>
        </div>

        {/* Панель ставок */}
        <div className='lg:col-span-1'>
          <div className='sticky top-[98px] space-y-6 p-6 border rounded-lg bg-card'>
            <div className='space-y-2'>
              <h2 className='text-xl font-semibold'>Текущая цена</h2>
              <p className='text-3xl font-bold'>
                {new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: "RUB",
                }).format(auction.currentPrice)}
              </p>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Осталось времени</h3>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Clock className='h-4 w-4' />
                <span>{timeLeft}</span>
              </div>
            </div>

            <form onSubmit={handleBidSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='bidAmount'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  Ваша ставка
                </label>
                <Input
                  id='bidAmount'
                  type='number'
                  placeholder='Введите сумму'
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={auction.currentPrice}
                  step={1000}
                />
              </div>
              <Button type='submit' className='w-full'>
                Сделать ставку
              </Button>
            </form>

            <div className='text-sm text-muted-foreground'>
              <p>Минимальный шаг ставки: 1 000 ₽</p>
              <p>Ставка не может быть меньше текущей цены</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
