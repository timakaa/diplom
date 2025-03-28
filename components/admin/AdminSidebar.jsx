"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LogOut, ChevronRight, LayoutDashboard } from "lucide-react";

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const navItems = [
    {
      name: "Обзор",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "Пользователи",
      href: "/admin/users",
      icon: Users,
    },
    /* Временно скрыты
    {
      name: "Аукционы",
      href: "/admin/auctions",
      icon: Car,
    },
    {
      name: "Статистика",
      href: "/admin/stats",
      icon: BarChart3,
    },
    {
      name: "Настройки",
      href: "/admin/settings",
      icon: Settings,
    },
    */
  ];

  const isActive = (item) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const handleNavClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={`h-screen bg-background border-r flex flex-col ${
        expanded ? "w-64" : "w-20"
      } transition-all duration-300 ease-in-out`}
    >
      <div className='p-4 border-b flex items-center justify-between bg-primary/5'>
        <h2
          className={`font-semibold text-foreground ${
            expanded ? "block" : "hidden"
          }`}
        >
          Админ-панель
        </h2>
        <button
          onClick={() => setExpanded(!expanded)}
          className='p-2 rounded-md hover:bg-primary/10 text-primary'
        >
          <ChevronRight
            className={`h-5 w-5 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <nav className='flex-1 p-4'>
        <ul className='space-y-2'>
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-foreground"
                  }`}
                  onClick={handleNavClick}
                >
                  <item.icon
                    className={`h-5 w-5 ${expanded ? "mr-3" : "mx-auto"}`}
                  />
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className='p-4 border-t'>
        <Link
          href='/'
          className='flex items-center p-2 rounded-md hover:bg-muted/50 text-foreground'
          onClick={handleNavClick}
        >
          <LogOut className={`h-5 w-5 ${expanded ? "mr-3" : "mx-auto"}`} />
          {expanded && <span>Вернуться на сайт</span>}
        </Link>
      </div>
    </div>
  );
}
