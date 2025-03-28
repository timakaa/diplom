"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }) {
  // Calculate time left
  const getTimeLeft = () => {
    const now = new Date();
    const endDate = new Date(auction.endDate);
    const diff = endDate - now;

    if (diff <= 0) {
      return "Завершен";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days}д ${hours}ч осталось`;
    } else if (hours > 0) {
      return `${hours}ч ${minutes}м осталось`;
    } else {
      return `${minutes}м осталось`;
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  return (
    <div className='group relative overflow-hidden rounded-lg border bg-background p-2 hover:shadow-md transition-all duration-200'>
      <div className='aspect-[16/9] overflow-hidden rounded-lg'>
        <Image
          src='/placeholder.svg'
          alt={auction.title}
          width={400}
          height={200}
          className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-200'
        />
      </div>
      <div className='mt-4 space-y-2'>
        <h3 className='font-semibold leading-none tracking-tight'>
          {auction.title}
        </h3>
        <p className='text-sm text-muted-foreground'>
          {auction.mileage
            ? `${auction.mileage.toLocaleString()} км`
            : "Пробег не указан"}{" "}
          • {auction.year || "Год не указан"}
        </p>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>
              {formatPrice(auction.currentPrice)}
            </p>
            <p className='text-xs text-muted-foreground'>
              Ставок: {auction.bids || 0}
            </p>
          </div>
          <div className='flex items-center gap-1 text-sm text-muted-foreground'>
            <Clock className='h-4 w-4' />
            <span>{getTimeLeft()}</span>
          </div>
        </div>
        <Link href={`/auctions/${auction.id}`}>
          <Button className='w-full mt-2' variant='outline'>
            Посмотреть аукцион
          </Button>
        </Link>
      </div>
    </div>
  );
}
