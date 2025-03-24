"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../ui/Logo";
import NavLinks from "../ui/NavLinks";
import UserAuthInfo from "../ui/UserAuthInfo";
import MobileMenu from "../ui/MobileMenu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex items-center justify-between h-16 py-4'>
        <Logo />
        <NavLinks />
        <div className='flex items-center gap-4'>
          <div className='hidden md:block'>
            <UserAuthInfo />
          </div>
          <Button
            variant='outline'
            size='icon'
            className='md:hidden'
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Меню</span>
          </Button>
        </div>
      </div>

      {/* Мобильное меню */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
