import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AuctionCard from "@/components/AuctionCard";

// Sample auction data
const auctions = [
  {
    id: 1,
    title: "Porsche 911 Carrera",
    price: "₽8,500,000",
    endTime: "2 дня",
    bids: 12,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "BMW M5 Competition",
    price: "₽7,200,000",
    endTime: "4 часа",
    bids: 20,
    image: "/placeholder.svg?height=400&width=600",
    endingSoon: true,
  },
  {
    id: 3,
    title: "Mercedes-Benz G-Class",
    price: "₽12,300,000",
    endTime: "1 день",
    bids: 8,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Audi RS7 Sportback",
    price: "₽9,750,000",
    endTime: "5 дней",
    bids: 6,
    image: "/placeholder.svg?height=400&width=600",
    noReserve: true,
  },
];

export default function FeaturedAuctions() {
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
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value='new-arrivals' className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value='no-reserve' className='mt-6'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {auctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
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
