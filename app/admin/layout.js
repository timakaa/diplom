"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      {/* Мобильная шапка */}
      <div className='md:hidden flex items-center justify-between p-4 border-b bg-primary/5'>
        <h1 className='font-semibold text-foreground'>Админ-панель</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className='p-2 rounded-md hover:bg-primary/10 text-primary'
        >
          <Menu className='h-5 w-5' />
        </button>
      </div>

      {/* Боковая панель (скрыта на мобильных устройствах, если не открыта) */}
      <div
        className={`
        ${mobileMenuOpen ? "block" : "hidden"} 
        md:block fixed inset-0 z-50 md:relative md:z-0
        md:w-auto
      `}
      >
        <div
          className='absolute inset-0 bg-black/50 md:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className='relative z-10 h-full'>
          <AdminSidebar onClose={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Основной контент */}
      <div className='flex-1 overflow-auto'>{children}</div>
    </div>
  );
}
