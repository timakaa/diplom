"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AuctionCard from "@/components/AuctionCard";
import { useQuery } from "@tanstack/react-query";

const fetchFeaturedAuctions = async () => {
  const response = await fetch("/api/auctions?limit=3&status=active");
  if (!response.ok) {
    throw new Error("Ошибка загрузки аукционов");
  }
  return response.json();
};

export default function FeaturedAuctions() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["featured-auctions"],
    queryFn: fetchFeaturedAuctions,
  });

  const auctions = data?.auctions || [];

  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/50'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
              Избранные аукционы
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Изучите наши самые популярные аукционы, которые скоро закончатся.
              Не упустите шанс сделать ставку.
            </p>
          </div>
        </div>
        <Tabs
          defaultValue='ending-soon'
          className='w-full max-w-6xl mx-auto mt-8'
        >
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='ending-soon'>Скоро закончатся</TabsTrigger>
            <TabsTrigger value='new-arrivals'>Новые поступления</TabsTrigger>
            <TabsTrigger value='no-reserve'>Без резерва</TabsTrigger>
          </TabsList>
          <TabsContent value='ending-soon' className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isLoading ? (
                <div className='col-span-full text-center py-8'>
                  Загрузка...
                </div>
              ) : error ? (
                <div className='col-span-full text-center py-8 text-red-500'>
                  Ошибка загрузки аукционов
                </div>
              ) : auctions.length === 0 ? (
                <div className='col-span-full text-center py-8'>
                  Аукционы не найдены
                </div>
              ) : (
                auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value='new-arrivals' className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isLoading ? (
                <div className='col-span-full text-center py-8'>
                  Загрузка...
                </div>
              ) : error ? (
                <div className='col-span-full text-center py-8 text-red-500'>
                  Ошибка загрузки аукционов
                </div>
              ) : auctions.length === 0 ? (
                <div className='col-span-full text-center py-8'>
                  Аукционы не найдены
                </div>
              ) : (
                auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value='no-reserve' className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {isLoading ? (
                <div className='col-span-full text-center py-8'>
                  Загрузка...
                </div>
              ) : error ? (
                <div className='col-span-full text-center py-8 text-red-500'>
                  Ошибка загрузки аукционов
                </div>
              ) : auctions.length === 0 ? (
                <div className='col-span-full text-center py-8'>
                  Аукционы не найдены
                </div>
              ) : (
                auctions.map((auction) => (
                  <AuctionCard key={auction.id} auction={auction} />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
        <div className='flex justify-center mt-8'>
          <Link href='/auctions'>
            <Button variant='outline' className='gap-1'>
              Посмотреть все аукционы
              <ChevronRight className='h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
