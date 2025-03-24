import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProfileFavorites({ favoriteAuctions }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Избранные аукционы</CardTitle>
        <CardDescription>Аукционы, которые вы отметили</CardDescription>
      </CardHeader>
      <CardContent>
        {favoriteAuctions.length > 0 ? (
          <div className='grid grid-cols-1 gap-4'>
            {favoriteAuctions.map((auction) => (
              <div
                key={auction.id}
                className='border rounded-lg p-4 flex gap-4'
              >
                <div className='bg-muted rounded-md overflow-hidden w-20 h-16 flex-shrink-0'>
                  <Image
                    src={auction.image}
                    width={80}
                    height={64}
                    alt={auction.title}
                    className='object-cover w-full h-full'
                  />
                </div>
                <div className='flex-1'>
                  <h3 className='font-medium'>{auction.title}</h3>
                  <p className='text-primary font-semibold'>{auction.price}</p>
                  <div className='flex items-center mt-2 text-sm text-muted-foreground'>
                    <Clock className='h-4 w-4 mr-1' />
                    <span>{auction.timeLeft}</span>
                    <span className='mx-2'>·</span>
                    <span>{auction.bids} ставок</span>
                  </div>
                  <div className='mt-2'>
                    <Link href={`/auctions/${auction.id}`} passHref>
                      <Button size='sm'>Открыть аукцион</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
