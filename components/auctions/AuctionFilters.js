"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

export default function AuctionFilters({
  selectedStatus,
  priceRange,
  yearRange,
  onFilterChange,
  onReset,
}) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Фильтры</h2>
        <Button
          variant='ghost'
          size='sm'
          className='h-8 text-sm'
          onClick={onReset}
        >
          Сбросить все
        </Button>
      </div>

      {/* Статус аукциона */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Статус</h3>
        <div className='space-y-2'>
          <label className='flex items-center space-x-2 text-sm'>
            <input
              type='radio'
              name='status'
              value='active'
              checked={selectedStatus === "active"}
              onChange={onFilterChange}
              className='rounded border-gray-200'
            />
            <span>Активные</span>
          </label>
          <label className='flex items-center space-x-2 text-sm'>
            <input
              type='radio'
              name='status'
              value='ended'
              checked={selectedStatus === "ended"}
              onChange={onFilterChange}
              className='rounded border-gray-200'
            />
            <span>Завершенные</span>
          </label>
        </div>
      </div>

      {/* Линия-разделитель */}
      <div className='h-px bg-border' />

      {/* Ценовой диапазон */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Ценовой диапазон</h3>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Input
              type='number'
              name='priceMin'
              placeholder='Мин.'
              className='h-9 text-sm'
              value={priceRange.min}
              onChange={onFilterChange}
            />
          </div>
          <div>
            <Input
              type='number'
              name='priceMax'
              placeholder='Макс.'
              className='h-9 text-sm'
              value={priceRange.max}
              onChange={onFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Линия-разделитель */}
      <div className='h-px bg-border' />

      {/* Год выпуска */}
      <div className='space-y-3'>
        <h3 className='text-sm font-medium'>Год выпуска</h3>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <Input
              type='number'
              name='yearMin'
              placeholder='От'
              className='h-9 text-sm'
              value={yearRange.min}
              onChange={onFilterChange}
            />
          </div>
          <div>
            <Input
              type='number'
              name='yearMax'
              placeholder='До'
              className='h-9 text-sm'
              value={yearRange.max}
              onChange={onFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Применить фильтры на мобильных */}
      <div className='lg:hidden mt-4'>
        <Button className='w-full'>
          <Filter className='h-4 w-4 mr-2' />
          Применить фильтры
        </Button>
      </div>
    </div>
  );
}
