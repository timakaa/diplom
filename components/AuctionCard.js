import { Card, CardContent } from "./ui/card";
import { Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AuctionCard({ auction }) {
  // Если аукцион не передан, используем заглушку для превью
  const defaultAuction = {
    id: 1,
    title: "2020 Мерседес-Бенц C300",
    price: "2 850 000 ₽",
    description: "51 500 км • Автомат • Премиум пакет",
    endTime: "23ч 45м",
    bids: 12,
    image: "/placeholder.svg?height=200&width=400",
    endingSoon: true,
  };

  const {
    id,
    title,
    price,
    description,
    endTime,
    bids,
    image,
    endingSoon,
    noReserve,
  } = auction || defaultAuction;

  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <div className='relative'>
        <Image
          src={image}
          width={400}
          height={200}
          alt={`${title} на аукционе`}
          className='object-cover w-full h-48'
        />
        {endingSoon && (
          <Badge className='absolute top-2 right-2 bg-primary'>
            Скоро закончится
          </Badge>
        )}
        {noReserve && (
          <Badge className='absolute top-2 right-2 bg-destructive'>
            Без резервной цены
          </Badge>
        )}
      </div>
      <CardContent className='p-4'>
        <div className='space-y-2'>
          <div className='flex justify-between items-start'>
            <h3 className='font-bold line-clamp-1'>{title}</h3>
            <div className='text-sm font-medium text-primary'>{price}</div>
          </div>
          <p className='text-sm text-muted-foreground line-clamp-1'>
            {description || "51 500 км • Автомат • Премиум пакет"}
          </p>
          <div className='flex items-center justify-between pt-2'>
            <div className='flex items-center text-sm text-muted-foreground'>
              <Clock className='h-4 w-4 mr-1' />
              <span>{endTime} осталось</span>
            </div>
            <div className='text-sm text-muted-foreground'>{bids} ставок</div>
          </div>
          <Link href={`/auctions/${id}`}>
            <Button className='w-full mt-2'>Посмотреть аукцион</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
