"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <div className='max-w-md w-full mx-auto p-6'>
        <div className='text-center space-y-6'>
          <div className='flex justify-center'>
            <CheckCircle className='h-16 w-16 text-green-500' />
          </div>

          <div className='space-y-2'>
            <h1 className='text-2xl font-bold text-foreground'>
              Оплата прошла успешно!
            </h1>
            <p className='text-muted-foreground'>
              Ваш платеж был успешно обработан. Теперь вы можете продолжить и
              завершить обновление плана.
            </p>
          </div>

          <div className='space-y-3'>
            <p className='text-sm text-muted-foreground'>
              Пожалуйста, вернитесь на предыдущую страницу и нажмите
              "Продолжить", чтобы завершить обновление плана.
            </p>

            <Link href='/plans'>
              <Button className='w-full'>Вернуться к планам</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
