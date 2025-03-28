"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuctionSearch({
  searchQuery,
  onSearchChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className='flex max-w-md items-center space-x-2'>
      <div className='relative flex-1'>
        <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
          <Search className='h-4 w-4 text-muted-foreground' />
        </div>
        <Input
          type='search'
          placeholder='Поиск по марке, модели или году'
          className='flex-1 pl-10 pr-4 py-6 text-base rounded-xl border-primary/10 shadow-sm 
                     focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        type='submit'
        className='py-6 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200'
      >
        Найти
      </Button>
    </form>
  );
}
