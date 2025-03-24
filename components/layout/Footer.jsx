import Link from "next/link";
import Logo from "../ui/Logo";
import FooterColumn from "../footer/FooterColumn";

export default function Footer() {
  // Quick links column data
  const quickLinks = {
    title: "Быстрые ссылки",
    links: [
      { title: "Главная", href: "/" },
      { title: "Аукционы", href: "/auctions" },
      { title: "Как это работает", href: "/how-it-works" },
    ],
  };

  // Resources column data
  const resources = {
    title: "Ресурсы",
    links: [{ title: "Часто задаваемые вопросы", href: "/faq" }],
  };

  return (
    <footer className='w-full py-6 md:py-12 border-t'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-8 md:grid-cols-2'>
          {/* Logo and description */}
          <div className='space-y-4'>
            <Logo />
            <p className='text-sm text-muted-foreground max-w-xs'>
              Главное место для автомобильных аукционов. Найдите автомобиль
              своей мечты по правильной цене.
            </p>
          </div>

          {/* Links section */}
          <div className='grid grid-cols-2 gap-8'>
            {/* Quick links */}
            <FooterColumn title={quickLinks.title} links={quickLinks.links} />

            {/* Resources */}
            <FooterColumn title={resources.title} links={resources.links} />
          </div>
        </div>

        {/* Copyright and terms */}
        <div className='mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-xs text-muted-foreground'>
            © 2025 АвтоАукцион. Все права защищены.
          </p>
          <div className='flex items-center gap-4 mt-4 md:mt-0'>
            <Link
              href='/privacy'
              className='text-muted-foreground hover:text-foreground text-xs'
            >
              Политика конфиденциальности
            </Link>
            <Link
              href='/terms'
              className='text-muted-foreground hover:text-foreground text-xs'
            >
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
