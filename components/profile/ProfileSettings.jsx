import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ProfileSettings({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки профиля</CardTitle>
        <CardDescription>Управление настройками аккаунта</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Личные данные */}
        <div className='space-y-2'>
          <h3 className='font-medium'>Личные данные</h3>
          <div className='grid gap-4'>
            <div>
              <label className='text-sm text-muted-foreground'>Имя</label>
              <input
                type='text'
                className='mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
                disabled
                value={user?.name || ""}
              />
            </div>
            <div>
              <label className='text-sm text-muted-foreground'>Email</label>
              <input
                type='email'
                className='mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
                disabled
                value={user?.email || ""}
              />
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className='space-y-2'>
          <h3 className='font-medium'>Уведомления</h3>
          <div className='flex items-center justify-between border rounded-md p-3'>
            <div>
              <p className='font-medium'>Уведомления по email</p>
              <p className='text-sm text-muted-foreground'>
                Получать уведомления о ставках и аукционах
              </p>
            </div>
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='email-notifications'
                className='h-4 w-4 rounded text-primary'
                defaultChecked
              />
              <label htmlFor='email-notifications' className='ml-2 text-sm'>
                Включить
              </label>
            </div>
          </div>
        </div>

        {/* Информация об аккаунте */}
        <div className='rounded-md bg-muted/50 p-4'>
          <div className='flex gap-3'>
            <AlertCircle className='h-5 w-5 text-muted-foreground' />
            <div>
              <h3 className='font-medium'>Информация об аккаунте</h3>
              <p className='text-sm text-muted-foreground'>
                Ваш аккаунт настроен через Google и управляется через этот
                сервис.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled>Сохранить настройки</Button>
      </CardFooter>
    </Card>
  );
}
