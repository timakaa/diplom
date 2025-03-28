"use client";

import { SlidersHorizontal, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuctionCard from "@/components/AuctionCard";

export default function AuctionResults({ data, isLoading, error }) {
  return (
    <div className='space-y-6'>
      {/* Сортировка и счетчик */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <p className='text-sm text-muted-foreground'>
            {isLoading
              ? "Загрузка..."
              : `Найдено ${data?.pagination.total || 0} аукционов`}
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='h-8 gap-1'>
            <SlidersHorizontal className='h-3.5 w-3.5' />
            <span>Сортировка</span>
          </Button>
          <Button variant='outline' size='sm' className='h-8 gap-1'>
            <Clock className='h-3.5 w-3.5' />
            <span>Скоро закончатся</span>
          </Button>
        </div>
      </div>

      {/* Сетка аукционов */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {isLoading ? (
          <div className='col-span-full text-center py-8'>Загрузка...</div>
        ) : error ? (
          <div className='col-span-full text-center py-8 text-red-500'>
            Ошибка загрузки аукционов
          </div>
        ) : data?.auctions.length === 0 ? (
          <div className='col-span-full text-center py-8'>
            Аукционы не найдены
          </div>
        ) : (
          data?.auctions.map((auction) => (
            <div key={auction.id} className='auction-card'>
              <AuctionCard auction={auction} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
