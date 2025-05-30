import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users } from "lucide-react";

export const metadata = {
  title: "Админ-панель | АвтоАукцион",
  description: "Административная панель управления сайтом",
};

export default async function AdminPage() {
  const session = await auth();

  // Проверяем авторизацию и права администратора
  if (!session) {
    redirect("/auth/signin?callbackUrl=/admin");
  }

  // Проверяем наличие прав администратора
  if (!session.user.isAdmin) {
    console.log(session.user);
    redirect("/");
  }

  const adminSections = [
    {
      title: "Пользователи",
      description: "Управление пользователями и их правами",
      icon: Users,
      link: "/admin/users",
    },
    /* Временно скрыты
    {
      title: "Аукционы",
      description: "Управление активными и архивными аукционами",
      icon: Car,
      link: "/admin/auctions",
    },
    {
      title: "Статистика",
      description: "Просмотр статистики по сайту и аукционам",
      icon: BarChart3,
      link: "/admin/stats",
    },
    */
  ];

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-4'>Административная панель</h1>
        <p className='text-muted-foreground max-w-2xl'>
          Управление пользователями, аукционами и системой
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-1 gap-6 max-w-xl'>
        {adminSections.map((section) => (
          <Link href={section.link} key={section.title} className='block'>
            <div className='p-6 border rounded-lg shadow-sm transition-all hover:shadow-md hover:border-primary/50 hover:bg-primary/5'>
              <div className='flex items-center gap-3 mb-3'>
                <section.icon className='h-6 w-6 text-primary' />
                <h2 className='text-xl font-semibold text-foreground'>
                  {section.title}
                </h2>
              </div>
              <p className='text-muted-foreground mb-4'>
                {section.description}
              </p>
              <button className='w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-4 py-2 rounded-md transition-colors'>
                Открыть
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
