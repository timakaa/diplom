"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAllBidsForAuction } from "@/lib/hooks/useAllBidsForAuction";

/**
 * Component to display the bid history for an auction
 */
export default function AuctionBidsHistory({ auctionId }) {
  const [page, setPage] = useState(1);
  const pageSize = 5; // Количество ставок на странице

  // Получаем ставки с помощью хука
  const { data, isLoading, isError } = useAllBidsForAuction(auctionId, {
    page,
    pageSize,
  });

  // Форматируем цену
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Получаем текст статуса ставки
  const getStatusText = (status) => {
    const statusMap = {
      active: "Активная",
      won: "Выигравшая",
      outbid: "Перебита",
      expired: "Истекла",
    };
    return statusMap[status] || status;
  };

  // Получаем вариант бейджа в зависимости от статуса
  const getBadgeVariant = (status) => {
    const variantMap = {
      active: "success",
      won: "success",
      outbid: "secondary",
      expired: "destructive",
    };
    return variantMap[status] || "default";
  };

  // Форматируем дату и время
  const formatDate = (dateString) => {
    try {
      // Парсим дату
      const bidDate = new Date(dateString);
      const now = new Date(new Date().getTime() + 3 * 60 * 60 * 1000); // UTC+3

      // Проверяем валидность даты
      if (isNaN(bidDate.getTime())) {
        return "некорректная дата";
      }

      // Вычисляем разницу в миллисекундах
      const diffMs = now.getTime() - bidDate.getTime();

      // Конвертируем в секунды, минуты, часы и дни
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Определяем формат вывода
      if (seconds < 60) {
        return "только что";
      }

      if (minutes < 60) {
        return `${minutes} ${getMinuteForm(minutes)} назад`;
      }

      if (hours < 24) {
        return `${hours} ${getHourForm(hours)} назад`;
      }

      return `${days} ${getDayForm(days)} назад`;
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return "ошибка даты";
    }
  };

  // Вспомогательные функции для склонения
  const getDayForm = (number) => {
    if (number >= 11 && number <= 19) return "дней";
    const lastDigit = number % 10;
    if (lastDigit === 1) return "день";
    if (lastDigit >= 2 && lastDigit <= 4) return "дня";
    return "дней";
  };

  const getHourForm = (number) => {
    if (number >= 11 && number <= 19) return "часов";
    const lastDigit = number % 10;
    if (lastDigit === 1) return "час";
    if (lastDigit >= 2 && lastDigit <= 4) return "часа";
    return "часов";
  };

  const getMinuteForm = (number) => {
    if (number >= 11 && number <= 19) return "минут";
    const lastDigit = number % 10;
    if (lastDigit === 1) return "минута";
    if (lastDigit >= 2 && lastDigit <= 4) return "минуты";
    return "минут";
  };

  // Обработчики пагинации
  const goToNextPage = () => {
    if (data && page < data.pagination.totalPages) {
      setPage(page + 1);
    }
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>История ставок</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-6'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : isError ? (
          <div className='text-center py-6 text-destructive'>
            Ошибка при загрузке истории ставок
          </div>
        ) : data.bids.length === 0 ? (
          <div className='text-center py-6 text-muted-foreground'>
            На этот аукцион еще не было сделано ставок
          </div>
        ) : (
          <>
            <div className='space-y-4'>
              {data.bids.map((bid) => (
                <div
                  key={bid.id}
                  className='flex justify-between items-center border-b pb-3'
                >
                  <div>
                    <p className='font-medium'>{formatPrice(bid.amount)}</p>
                    <p className='text-sm text-muted-foreground'>
                      {formatDate(bid.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getBadgeVariant(bid.status)}>
                    {getStatusText(bid.status)}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {data.pagination.totalPages > 1 && (
              <div className='flex justify-between items-center mt-4'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToPrevPage}
                  disabled={page === 1}
                >
                  Назад
                </Button>
                <span className='text-sm text-muted-foreground'>
                  Страница {page} из {data.pagination.totalPages}
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={goToNextPage}
                  disabled={page >= data.pagination.totalPages}
                >
                  Вперед
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
