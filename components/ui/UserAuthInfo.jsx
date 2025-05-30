"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  UserCircle,
  ChevronDown,
  Wallet,
  Plus,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserAuthInfo() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(balance || 0);
  };

  if (loading) {
    return (
      <Button
        variant='ghost'
        size='sm'
        disabled
        className='hidden md:inline-flex'
      >
        Загрузка...
      </Button>
    );
  }

  if (session) {
    return (
      <div className='flex items-center gap-3'>
        {/* Отображение баланса */}
        <div className='hidden md:flex items-center gap-2 text-sm text-muted-foreground border rounded-md px-3 py-1.5'>
          <Wallet className='h-4 w-4' />
          <span>{formatBalance(session.user.balance)}</span>
        </div>

        {/* Десктопная версия - выпадающее меню */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='hidden md:flex'>
            <Button
              variant='ghost'
              size='sm'
              className='flex items-center gap-3 px-4 py-5 rounded-md hover:bg-accent'
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  width={32}
                  height={32}
                  alt={session.user.name || "Пользователь"}
                  className='rounded-full h-8 w-8 object-cover'
                />
              ) : (
                <div className='h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center'>
                  <User className='h-4 w-4 text-primary' />
                </div>
              )}
              <div className='flex items-center'>
                <span className='text-sm font-medium mr-2'>
                  {session.user.name?.split(" ")[0] || "Пользователь"}
                </span>
                <ChevronDown className='h-4 w-4 opacity-70' />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-56 p-2 mt-2'
            sideOffset={8}
          >
            <DropdownMenuLabel className='px-3 py-2 text-base'>
              Мой аккаунт
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='my-2' />

            <Link href='/auctions/create'>
              <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                <Plus className='mr-3 h-5 w-5' />
                <span>Создать аукцион</span>
              </DropdownMenuItem>
            </Link>

            <Link href='/profile'>
              <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                <UserCircle className='mr-3 h-5 w-5' />
                <span>Личный кабинет</span>
              </DropdownMenuItem>
            </Link>

            {/* Админ-панель (только для администраторов) */}
            {session.user.isAdmin && (
              <Link href='/admin'>
                <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                  <ShieldCheck className='mr-3 h-5 w-5' />
                  <span>Админ-панель</span>
                </DropdownMenuItem>
              </Link>
            )}

            <DropdownMenuItem
              onClick={() => signOut()}
              className='cursor-pointer text-destructive focus:text-destructive px-3 py-2.5 rounded-md mt-1'
            >
              <LogOut className='mr-3 h-5 w-5' />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Мобильная версия - выпадающее меню */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              className='h-10 w-10 rounded-full'
            >
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  width={32}
                  height={32}
                  alt={session.user.name || "Пользователь"}
                  className='rounded-full h-8 w-8 object-cover'
                />
              ) : (
                <User className='h-5 w-5' />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56 p-2' sideOffset={8}>
            <DropdownMenuLabel className='px-3 py-2 text-base'>
              {session.user.name || "Пользователь"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='my-2' />

            <Link href='/auctions/create'>
              <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                <Plus className='mr-3 h-5 w-5' />
                <span>Создать аукцион</span>
              </DropdownMenuItem>
            </Link>

            <Link href='/profile'>
              <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                <UserCircle className='mr-3 h-5 w-5' />
                <span>Личный кабинет</span>
              </DropdownMenuItem>
            </Link>

            {/* Админ-панель (только для администраторов) */}
            {session.user.isAdmin && (
              <Link href='/admin'>
                <DropdownMenuItem className='cursor-pointer px-3 py-2.5 rounded-md'>
                  <ShieldCheck className='mr-3 h-5 w-5' />
                  <span>Админ-панель</span>
                </DropdownMenuItem>
              </Link>
            )}

            <DropdownMenuItem
              onClick={() => signOut()}
              className='cursor-pointer text-destructive focus:text-destructive px-3 py-2.5 rounded-md mt-1'
            >
              <LogOut className='mr-3 h-5 w-5' />
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-3'>
      {/* Кнопки для десктопа */}
      <Link href='/auth/signin' className='hidden md:inline-flex'>
        <Button variant='ghost' size='sm' className='px-4'>
          Войти
        </Button>
      </Link>
      <Link href='/auth/register' className='hidden md:inline-flex'>
        <Button size='sm' className='px-4'>
          Регистрация
        </Button>
      </Link>

      {/* Кнопка для мобильной версии */}
      <Button
        variant='ghost'
        size='icon'
        className='md:hidden h-10 w-10 rounded-full'
        onClick={() => signIn("google")}
      >
        <User className='h-5 w-5' />
        <span className='sr-only'>Войти</span>
      </Button>
    </div>
  );
}
