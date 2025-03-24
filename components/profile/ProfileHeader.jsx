import Image from "next/image";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfileHeader({ user }) {
  if (!user) return null;

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
          <Badge variant='outline' className='mt-1'>
            Базовый аккаунт
          </Badge>
        </div>
      </div>
    </div>
  );
}
