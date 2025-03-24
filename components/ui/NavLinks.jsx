"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  // Array of navigation links for easier management
  const navItems = [
    { title: "Главная", href: "/", active: pathname === "/" },
    { title: "Аукционы", href: "/auctions", active: pathname === "/auctions" },
    {
      title: "Как это работает",
      href: "/how-it-works",
      active: pathname === "/how-it-works",
    },
  ];

  return (
    <nav className='hidden md:flex items-center gap-6 text-sm'>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`font-medium ${
            item.active ? "" : "text-muted-foreground"
          } transition-colors hover:text-primary`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
