import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { Edit, Trash2 } from "lucide-react";

export const metadata = {
  title: "Управление пользователями | Админ-панель",
  description: "Управление пользователями и правами доступа",
};

export default async function AdminUsersPage() {
  const session = await auth();

  // Проверяем авторизацию и права администратора
  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin/users");
  }

  // Проверяем наличие прав администратора
  if (!session.user.isAdmin) {
    redirect("/");
  }

  // Получаем список всех пользователей
  const allUsers = await db.select().from(users).orderBy(users.email);

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4 text-foreground'>
          Управление пользователями
        </h1>
        <p className='text-muted-foreground max-w-2xl'>
          Просмотр и редактирование информации о пользователях
        </p>
      </div>

      <div className='bg-background rounded-lg shadow-sm border overflow-hidden'>
        <div className='p-4 border-b bg-primary/5 flex justify-between items-center'>
          <h2 className='font-semibold text-foreground'>
            Список пользователей
          </h2>
          <button className='px-4 py-2 bg-primary/10 text-primary rounded-md border border-primary/20 hover:bg-primary/20 transition-colors'>
            Добавить пользователя
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full border-collapse'>
            <thead>
              <tr className='bg-muted/50 border-b'>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  ID
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  Имя
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  Email
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  План
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  Баланс
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  Админ
                </th>
                <th className='p-3 text-left font-medium text-muted-foreground'>
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user.id} className='border-b hover:bg-muted/20'>
                  <td className='p-3 text-sm'>{user.id.substring(0, 8)}...</td>
                  <td className='p-3 text-sm'>{user.name || "—"}</td>
                  <td className='p-3 text-sm'>{user.email}</td>
                  <td className='p-3 text-sm'>
                    <span className='px-2 py-1 rounded-full text-xs inline-block bg-primary/10 text-primary border border-primary/20'>
                      {user.plan || "basic"}
                    </span>
                  </td>
                  <td className='p-3 text-sm'>{user.balance || 0} ₽</td>
                  <td className='p-3 text-sm'>
                    {user.isAdmin ? (
                      <span className='bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs inline-block border border-green-200'>
                        Да
                      </span>
                    ) : (
                      <span className='bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs inline-block border border-gray-200'>
                        Нет
                      </span>
                    )}
                  </td>
                  <td className='p-3 text-sm'>
                    <div className='flex gap-2'>
                      <button className='p-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors'>
                        <Edit className='h-4 w-4' />
                        <span className='sr-only'>Редактировать</span>
                      </button>
                      <button className='p-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors'>
                        <Trash2 className='h-4 w-4' />
                        <span className='sr-only'>Удалить</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
