import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfileBids({ biddingHistory }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История ставок</CardTitle>
        <CardDescription>Ваши ставки на аукционах</CardDescription>
      </CardHeader>
      <CardContent>
        {biddingHistory.length > 0 ? (
          <div className='rounded-md border'>
            <div className='grid grid-cols-4 bg-muted p-3 text-sm font-medium'>
              <div>Дата</div>
              <div className='col-span-2'>Автомобиль</div>
              <div>Статус</div>
            </div>
            <div className='divide-y'>
              {biddingHistory.map((bid) => (
                <div key={bid.id} className='grid grid-cols-4 p-3 text-sm'>
                  <div className='text-muted-foreground'>
                    {bid.date}
                    <br />
                    {bid.time}
                  </div>
                  <div className='col-span-2'>
                    <p className='font-medium'>{bid.car}</p>
                    <p className='text-muted-foreground'>{bid.amount}</p>
                  </div>
                  <div>
                    <Badge
                      variant={
                        bid.status === "Активна"
                          ? "outline"
                          : bid.status === "Выиграна"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {bid.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='text-center py-6 text-muted-foreground'>
            У вас пока нет ставок на аукционах
          </div>
        )}
      </CardContent>
    </Card>
  );
}
