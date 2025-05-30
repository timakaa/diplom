"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl,
    });
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-muted/30'>
      <div className='w-full max-w-md space-y-8 rounded-lg bg-background p-8 shadow-md border'>
        <div className='text-center'>
          <div className='flex justify-center mb-6'>
            <Logo />
          </div>
          <h2 className='mt-6 text-3xl font-bold'>Создайте аккаунт</h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            Зарегистрируйтесь, чтобы участвовать в аукционах
          </p>
        </div>
        <div className='mt-8 space-y-4'>
          <Button
            onClick={handleGoogleSignIn}
            variant='outline'
            className='flex w-full justify-center gap-2 py-5'
          >
            <svg
              className='h-5 w-5'
              aria-hidden='true'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
            </svg>
            Регистрация через Google
          </Button>
        </div>
        <div className='mt-4 text-center'>
          <p className='text-sm text-muted-foreground'>
            Уже есть аккаунт?{" "}
            <Link href='/auth/signin' className='text-primary hover:underline'>
              Войдите
            </Link>
          </p>
          <div className='mt-2'>
            <Link href='/' className='text-sm text-primary hover:underline'>
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}
