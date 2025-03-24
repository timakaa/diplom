import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, Shield, FileText } from "lucide-react";
import Image from "next/image";

export default function ProfileOverview({
  biddingHistory,
  favoriteAuctions,
  onTabChange,
}) {
  return (
    <div className='space-y-6'>
      {/* Карточки со статистикой */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          title='Активные ставки'
          value='1'
          description='Активный аукцион'
          icon={<Car className='h-4 w-4 text-muted-foreground' />}
        />
        <StatCard
          title='Выигранные аукционы'
          value='1'
          description='Успешная сделка'
          icon={<FileText className='h-4 w-4 text-muted-foreground' />}
        />
        <StatCard
          title='Статус'
          value='Базовый'
          description='Подтвержденный участник'
          icon={<Shield className='h-4 w-4 text-muted-foreground' />}
        />
      </div>

      {/* Последние активности */}
      <Card>
        <CardHeader>
          <CardTitle>Последние активности</CardTitle>
          <CardDescription>История ваших ставок</CardDescription>
        </CardHeader>
        <CardContent>
          {biddingHistory.length > 0 ? (
            <div className='space-y-4'>
              {biddingHistory.slice(0, 2).map((bid) => (
                <div
                  key={bid.id}
                  className='flex items-center justify-between border-b pb-3'
                >
                  <div className='flex items-start gap-3'>
                    <Clock className='h-5 w-5 text-muted-foreground mt-0.5' />
                    <div>
                      <p className='font-medium'>{bid.car}</p>
                      <p className='text-sm text-muted-foreground'>
                        {bid.date} · {bid.time}
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>{bid.amount}</p>
                    <Badge
                      variant={
                        bid.status === "Активна"
                          ? "outline"
                          : bid.status === "Выиграна"
                          ? "default"
                          : "secondary"
                      }
                      className='mt-1'
                    >
                      {bid.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center py-2 text-muted-foreground'>
              Нет активностей
            </p>
          )}
        </CardContent>
        {biddingHistory.length > 0 && (
          <CardFooter>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => onTabChange("bids")}
            >
              Все ставки
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Избранные аукционы */}
      <Card>
        <CardHeader>
          <CardTitle>Избранное</CardTitle>
          <CardDescription>Интересные вам аукционы</CardDescription>
        </CardHeader>
        <CardContent>
          {favoriteAuctions.length > 0 ? (
            <div className='space-y-4'>
              {favoriteAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className='flex items-center justify-between border-b pb-3'
                >
                  <div className='flex items-center gap-3'>
                    <div className='bg-muted rounded-md overflow-hidden w-16 h-12 flex-shrink-0'>
                      <Image
                        src={auction.image}
                        width={64}
                        height={48}
                        alt={auction.title}
                        className='object-cover w-full h-full'
                      />
                    </div>
                    <div>
                      <p className='font-medium'>{auction.title}</p>
                      <p className='text-sm text-muted-foreground'>
                        {auction.timeLeft} · {auction.bids} ставок
                      </p>
                    </div>
                  </div>
                  <p className='font-medium'>{auction.price}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center py-2 text-muted-foreground'>
              Нет избранных аукционов
            </p>
          )}
        </CardContent>
        {favoriteAuctions.length > 0 && (
          <CardFooter>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => onTabChange("favorites")}
            >
              Все избранные
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

// Компонент статистической карточки
function StatCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
}
