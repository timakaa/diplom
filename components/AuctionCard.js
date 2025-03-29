"use client";

import Image from "next/image";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }) {
  // Calculate time left and check if auction is ended
  const getTimeLeftAndStatus = () => {
    const now = new Date();
    const endDate = new Date(auction.endDate);
    const diff = endDate - now;

    // Check if auction is ended
    if (diff <= 0 || auction.status === "archived") {
      return {
        text: "Завершен",
        isEnded: true,
      };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return {
        text: `${days}д ${hours}ч осталось`,
        isEnded: false,
      };
    } else if (hours > 0) {
      return {
        text: `${hours}ч ${minutes}м осталось`,
        isEnded: false,
      };
    } else {
      return {
        text: `${minutes}м осталось`,
        isEnded: false,
      };
    }
  };

  const { text: timeLeftText, isEnded } = getTimeLeftAndStatus();

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border bg-background p-2 hover:shadow-md transition-all duration-200 ${
        isEnded ? "bg-gray-100 dark:bg-gray-900" : ""
      }`}
    >
      {isEnded && (
        <div className='absolute top-3 right-3 z-10 rounded-full bg-gray-800 p-1.5'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='white'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-4 w-4'
          >
            <rect width='18' height='18' x='3' y='3' rx='2' ry='2' />
            <path d='M3 9h18' />
            <path d='M9 21V9' />
          </svg>
        </div>
      )}
      <div className='aspect-[16/9] overflow-hidden rounded-lg'>
        <Image
          src='/placeholder.svg'
          alt={auction.title}
          width={400}
          height={200}
          className={`object-cover w-full h-full ${
            isEnded
              ? "opacity-80"
              : "group-hover:scale-105 transition-transform duration-200"
          }`}
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
          <div
            className={`flex items-center gap-1 text-sm ${
              isEnded ? "text-gray-500" : "text-muted-foreground"
            }`}
          >
            {isEnded ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4'
              >
                <path d='M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z' />
                <path d='M8 15h8' />
              </svg>
            ) : (
              <Clock className='h-4 w-4' />
            )}
            <span>{timeLeftText}</span>
          </div>
        </div>
        <Link href={`/auctions/${auction.id}`}>
          <Button className='w-full mt-2' variant='outline'>
            {isEnded ? "Просмотр результатов" : "Посмотреть аукцион"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
