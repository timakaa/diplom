import { Gauge, Calendar, MapPin, Users } from "lucide-react";

export default function AuctionSpecs({ auction }) {
  return (
    <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
      <SpecItem
        icon={<Gauge className='h-5 w-5 text-muted-foreground' />}
        label='Пробег'
        value={`${auction.mileage?.toLocaleString() || "Н/Д"} км`}
      />
      <SpecItem
        icon={<Calendar className='h-5 w-5 text-muted-foreground' />}
        label='Год'
        value={auction.year || "Н/Д"}
      />
      <SpecItem
        icon={<MapPin className='h-5 w-5 text-muted-foreground' />}
        label='Локация'
        value={auction.location || "Не указана"}
      />
      <SpecItem
        icon={<Users className='h-5 w-5 text-muted-foreground' />}
        label='Ставок'
        value={auction.bids || 0}
      />
    </div>
  );
}

function SpecItem({ icon, label, value }) {
  return (
    <div className='flex items-center gap-2'>
      {icon}
      <div>
        <p className='text-sm text-muted-foreground'>{label}</p>
        <p className='font-medium'>{value}</p>
      </div>
    </div>
  );
}
