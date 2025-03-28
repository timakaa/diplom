import Image from "next/image";
import { User, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader({ user }) {
  if (!user) return null;

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(balance || 0);
  };

  return (
    <div className='flex flex-col md:flex-row gap-6 items-start mb-8'>
      <div className='flex-1'>
        <h1 className='text-3xl font-bold mb-2'>Личный кабинет</h1>
        <p className='text-muted-foreground'>
          Управляйте своим аккаунтом и просматривайте историю аукционов
        </p>
      </div>
      <div className='flex items-center gap-4 p-4 bg-muted/40 rounded-lg'>
        {user.image ? (
          <Image
            src={user.image}
            width={64}
            height={64}
            alt={user.name || "Аватар пользователя"}
            className='rounded-full h-16 w-16 object-cover'
          />
        ) : (
          <div className='h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center'>
            <User className='h-8 w-8 text-primary' />
          </div>
        )}
        <div>
          <h2 className='font-semibold text-lg'>{user.name}</h2>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
          <div className='flex flex-wrap gap-2 mt-1'>
            <Badge variant='outline'>
              {user.plan
                ? `${
                    user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                  } аккаунт`
                : "Нет плана"}
            </Badge>
            <Badge variant='outline' className='flex items-center gap-1'>
              <Wallet className='h-3 w-3' />
              {formatBalance(user.balance)}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
