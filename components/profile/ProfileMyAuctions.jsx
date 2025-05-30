"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Car,
  Calendar,
  DollarSign,
  Eye,
  Edit,
  Archive,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function ProfileMyAuctions() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const limit = 6;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["my-auctions", page],
    queryFn: async () => {
      const response = await fetch(
        `/api/auctions/my?page=${page}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }
      return response.json();
    },
    enabled: !!session?.user,
  });

  const auctions = data?.auctions || [];
  const totalPages = data?.totalPages || 1;
  const totalCount = data?.totalCount || 0;

  const getStatusBadge = (auction) => {
    const now = new Date();
    const endDate = new Date(auction.endDate);
    const startDate = new Date(auction.startDate);

    if (auction.status === "archived") {
      return <Badge variant='secondary'>Архивный</Badge>;
    }

    if (now < startDate) {
      return <Badge variant='outline'>Ожидает начала</Badge>;
    }

    if (now > endDate) {
      return <Badge variant='destructive'>Завершен</Badge>;
    }

    return <Badge variant='default'>Активный</Badge>;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <LoadingSpinner className='h-8 w-8' />
        <span className='ml-2'>Загрузка аукционов...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='destructive'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          Ошибка при загрузке аукционов: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (auctions.length === 0) {
    return (
      <Card>
        <CardContent className='py-12 text-center'>
          <Car className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold mb-2'>
            У вас пока нет аукционов
          </h3>
          <p className='text-muted-foreground mb-6'>
            Создайте свой первый аукцион и начните продавать автомобили
          </p>
          <Button asChild>
            <Link href='/auctions/create'>
              <Plus className='h-4 w-4 mr-2' />
              Создать аукцион
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Мои аукционы</h2>
          <p className='text-muted-foreground'>Всего аукционов: {totalCount}</p>
        </div>
        <Button asChild>
          <Link href='/auctions/create'>
            <Plus className='h-4 w-4 mr-2' />
            Создать аукцион
          </Link>
        </Button>
      </div>

      {/* Auctions Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {auctions.map((auction) => (
          <Card key={auction.id} className='overflow-hidden'>
            <CardHeader className='pb-3'>
              <div className='flex justify-between items-start'>
                <CardTitle
                  className='text-lg overflow-hidden text-ellipsis'
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: "1.2em",
                    maxHeight: "2.4em",
                  }}
                >
                  {auction.title}
                </CardTitle>
                {getStatusBadge(auction)}
              </div>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Car Info */}
              <div className='flex items-center text-sm text-muted-foreground'>
                <Car className='h-4 w-4 mr-2' />
                {auction.brand} {auction.model} ({auction.year})
              </div>

              {/* Price Info */}
              <div className='space-y-2'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Стартовая цена:
                  </span>
                  <span className='font-medium'>
                    {formatPrice(auction.startingPrice)}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-muted-foreground'>
                    Текущая цена:
                  </span>
                  <span className='font-bold text-lg'>
                    {formatPrice(auction.currentPrice)}
                  </span>
                </div>
              </div>

              {/* Timing */}
              <div className='flex items-center text-sm text-muted-foreground'>
                <Calendar className='h-4 w-4 mr-2' />
                Завершается{" "}
                {formatDistanceToNow(new Date(auction.endDate), {
                  addSuffix: true,
                  locale: ru,
                })}
              </div>

              {/* Bids Count */}
              <div className='flex items-center text-sm text-muted-foreground'>
                <DollarSign className='h-4 w-4 mr-2' />
                Ставок: {auction.bids || 0}
              </div>

              {/* Actions */}
              <div className='flex gap-2 pt-2'>
                <Button variant='outline' size='sm' asChild className='w-full'>
                  <Link href={`/auctions/${auction.id}`}>
                    <Eye className='h-4 w-4 mr-2' />
                    Просмотр
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='flex justify-center gap-2'>
          <Button
            variant='outline'
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Предыдущая
          </Button>
          <span className='flex items-center px-4 text-sm text-muted-foreground'>
            Страница {page} из {totalPages}
          </span>
          <Button
            variant='outline'
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            Следующая
          </Button>
        </div>
      )}
    </div>
  );
}
