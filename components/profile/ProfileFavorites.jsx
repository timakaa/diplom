"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ProfileFavorites() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const limit = 5;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["favorites", page],
    queryFn: async () => {
      const response = await fetch(
        `/api/favorites?page=${page}&limit=${limit}`,
      );
      if (!response.ok) throw new Error("Ошибка загрузки избранного");
      return response.json();
    },
    enabled: !!session?.user,
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (auctionId) => {
      const response = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId }),
      });
      if (!response.ok) throw new Error("Ошибка при удалении из избранного");
      return response.json();
    },
    onSuccess: () => {
      // Обновляем данные на текущей странице
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      toast({
        title: "Успешно",
        description: "Аукцион удален из избранного",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const favoriteAuctions = data?.favorites || [];
  const totalPages = data?.pagination?.totalPages || 0;

  const handleRemoveFavorite = async (auctionId) => {
    try {
      await removeFromFavorites.mutateAsync(auctionId);
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Избранные аукционы</CardTitle>
        <CardDescription>Аукционы, которые вы отметили</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='text-center py-8'>
            <div className='animate-pulse'>Загрузка...</div>
          </div>
        ) : favoriteAuctions.length > 0 ? (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 gap-4'>
              {favoriteAuctions.map((favorite) => {
                const auction = favorite.auction;
                const timeLeft = formatDistanceToNow(
                  new Date(auction.endDate),
                  {
                    addSuffix: true,
                    locale: ru,
                  },
                );

                return (
                  <div
                    key={favorite.id}
                    className='border rounded-lg p-4 flex gap-4'
                  >
                    <div className='bg-muted rounded-md overflow-hidden w-28 h-full flex-shrink-0'>
                      <Image
                        src={"/placeholder.svg"}
                        width={180}
                        height={124}
                        alt={auction.title}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='flex justify-between items-start'>
                        <h3 className='font-medium'>{auction.title}</h3>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleRemoveFavorite(auction.id)}
                          disabled={removeFromFavorites.isPending}
                          className='h-8 w-8'
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                      <p className='text-primary font-semibold'>
                        {auction.currentPrice.toLocaleString("ru-RU")} ₽
                      </p>
                      <div className='flex items-center mt-2 text-sm text-muted-foreground'>
                        <Clock className='h-4 w-4 mr-1' />
                        <span>{timeLeft}</span>
                        <span className='mx-2'>·</span>
                        <span>{auction.status}</span>
                      </div>
                      <div className='mt-2'>
                        <Link href={`/auctions/${auction.id}`} passHref>
                          <Button size='sm'>Открыть аукцион</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {totalPages > 1 && (
              <div className='flex justify-center gap-2 mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Назад
                </Button>
                <span className='py-2 px-3'>
                  Страница {page} из {totalPages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Вперед
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-8'>
            <Heart className='h-12 w-12 mx-auto text-muted' />
            <h3 className='mt-2 font-semibold'>Нет избранных аукционов</h3>
            <p className='text-sm text-muted-foreground mb-4'>
              Добавляйте аукционы в избранное
            </p>
            <Link href='/auctions' passHref>
              <Button>Смотреть аукционы</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
