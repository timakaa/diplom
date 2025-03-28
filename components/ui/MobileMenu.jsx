"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, User, LogOut, Wallet, ShieldCheck } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalFooter,
} from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function MobileMenu({ isOpen, onClose }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const formatBalance = (balance) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(balance || 0);
  };

  // Close menu only when path changes after initial render
  useEffect(() => {
    if (isOpen && prevPathRef.current !== pathname) {
      onClose();
    }
    prevPathRef.current = pathname;
  }, [pathname, isOpen, onClose]);

  // Navigation items
  const navItems = [
    { title: "Главная", href: "/" },
    { title: "Аукционы", href: "/auctions" },
    { title: "Как это работает", href: "/how-it-works" },
    { title: "Часто задаваемые вопросы", href: "/faq" },
  ];

  // Функция для выхода из системы
  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <ResponsiveModal open={isOpen} onOpenChange={onClose}>
      <ResponsiveModalContent
        side='right'
        className='p-0 border-none'
        hideCloseButton={true}
      >
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between h-16 px-4 border-b'>
            <ResponsiveModalHeader className='p-0'>
              <ResponsiveModalTitle className='text-base font-semibold text-foreground'>
                Меню
              </ResponsiveModalTitle>
            </ResponsiveModalHeader>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-5 w-5' />
              <span className='sr-only'>Закрыть</span>
            </Button>
          </div>

          <nav className='flex-1 overflow-auto py-6 px-4'>
            <ul className='space-y-6'>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-lg font-medium block py-2 ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary"
                    }`}
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ResponsiveModalFooter className='p-4 border-t mt-auto'>
            {loading ? (
              <div className='flex items-center justify-center py-2'>
                <p className='text-sm text-muted-foreground'>Загрузка...</p>
              </div>
            ) : session ? (
              <div className='flex flex-col gap-3'>
                {/* Информация о пользователе */}
                <div className='flex items-center gap-3 mb-2 p-2 rounded-md border'>
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      width={40}
                      height={40}
                      alt={session.user.name || "Аватар пользователя"}
                      className='rounded-full h-10 w-10 object-cover'
                    />
                  ) : (
                    <div className='h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center'>
                      <User className='h-5 w-5 text-primary' />
                    </div>
                  )}
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium'>
                      {session.user.name || "Пользователь"}
                    </p>
                    <p className='text-sm text-muted-foreground truncate max-w-full'>
                      {session.user.email}
                    </p>
                  </div>
                </div>

                {/* Баланс пользователя */}
                <div className='flex items-center justify-between p-2 border rounded-md mb-2'>
                  <div className='flex items-center gap-2'>
                    <Wallet className='h-5 w-5 text-muted-foreground' />
                    <span className='text-sm text-muted-foreground'>
                      Баланс:
                    </span>
                  </div>
                  <span className='font-medium'>
                    {formatBalance(session.user.balance)}
                  </span>
                </div>

                {/* Личный кабинет и другие опции */}
                <Link href='/profile' onClick={onClose}>
                  <Button variant='outline' className='w-full justify-center'>
                    Личный кабинет
                  </Button>
                </Link>

                {/* Админ-панель (только для администраторов) */}
                {session.user.isAdmin && (
                  <Link href='/admin' onClick={onClose}>
                    <Button
                      variant='outline'
                      className='w-full justify-center gap-2'
                    >
                      <ShieldCheck className='h-4 w-4' />
                      Админ-панель
                    </Button>
                  </Link>
                )}

                {/* Кнопка выхода */}
                <Button
                  onClick={handleSignOut}
                  className='w-full justify-center gap-2'
                >
                  <LogOut className='h-4 w-4' />
                  Выйти
                </Button>
              </div>
            ) : (
              <div className='flex flex-col gap-2'>
                <Link href='/auth/signin' onClick={onClose}>
                  <Button variant='outline' className='w-full justify-center'>
                    Войти
                  </Button>
                </Link>
                <Link href='/auth/register' onClick={onClose}>
                  <Button className='w-full justify-center'>Регистрация</Button>
                </Link>
              </div>
            )}
          </ResponsiveModalFooter>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
