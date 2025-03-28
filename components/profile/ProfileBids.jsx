"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useBids } from "@/lib/hooks/useBids";
import Link from "next/link";

export default function ProfileBids() {
  const { bids, pagination, isLoading, changePage } = useBids(1, 6);

  // Функция для определения варианта бейджа в зависимости от статуса ставки
  const getBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "outline";
      case "won":
        return "default";
      case "outbid":
        return "secondary";
      case "expired":
        return "destructive";
      default:
        return "secondary";
    }
  };

  // Функция для форматирования статуса ставки на русском
  const getStatusText = (status) => {
    switch (status) {
      case "active":
        return "Активна";
      case "won":
        return "Выиграна";
      case "outbid":
        return "Перебита";
      case "expired":
        return "Истекла";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>История ставок</CardTitle>
        <CardDescription>Ваши ставки на аукционах</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='flex justify-center py-10'>
            <Loader2 className='h-10 w-10 animate-spin text-muted-foreground' />
          </div>
        ) : bids.length > 0 ? (
          <div className='space-y-6'>
            <div className='rounded-md border'>
              <div className='grid grid-cols-4 bg-muted p-3 text-sm font-medium'>
                <div>Дата</div>
                <div className='col-span-2'>Аукцион</div>
                <div>Статус</div>
              </div>
              <div className='divide-y'>
                {bids.map((bid) => (
                  <div key={bid.id} className='grid grid-cols-4 p-3 text-sm'>
                    <div className='text-muted-foreground'>
                      {bid.formattedDate}
                      <br />
                      {new Date(bid.createdAt)
                        .getUTCHours()
                        .toString()
                        .padStart(2, "0")}
                      :
                      {new Date(bid.createdAt)
                        .getUTCMinutes()
                        .toString()
                        .padStart(2, "0")}
                    </div>
                    <div className='col-span-2'>
                      <Link
                        href={`/auctions/${bid.auctionId}`}
                        className='font-medium hover:underline'
                      >
                        Аукцион №{bid.auctionId}
                      </Link>
                      <p className='text-muted-foreground'>
                        Ставка: {bid.formattedAmount}
                      </p>
                    </div>
                    <div>
                      <Badge variant={getBadgeVariant(bid.status)}>
                        {getStatusText(bid.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Отображаем пагинацию только если у нас больше одной страницы */}
            {pagination.totalPages > 1 && (
              <div className='flex justify-between items-center'>
                <div className='text-sm text-muted-foreground'>
                  Страница {pagination.currentPage} из {pagination.totalPages}
                </div>
                <div className='flex gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => changePage(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                  >
                    <ChevronLeft className='h-4 w-4' />
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                  >
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className='text-center py-10 text-muted-foreground'>
            У вас пока нет ставок на аукционах
          </div>
        )}
      </CardContent>
    </Card>
  );
}
