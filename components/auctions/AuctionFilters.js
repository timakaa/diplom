"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function AuctionFilters({
  selectedStatus,
  priceRange,
  yearRange,
  onFilterChange,
  onReset,
}) {
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isYearOpen, setIsYearOpen] = useState(true);

  // Максимальный и минимальный год для селектов
  const currentYear = new Date().getFullYear();
  const minYear = 1980;
  const years = Array.from(
    { length: currentYear - minYear + 1 },
    (_, i) => currentYear - i,
  );

  // Обработчики для слайдера цены
  const handlePriceSliderChange = (values) => {
    const [min, max] = values;
    onFilterChange({ target: { name: "priceMin", value: min.toString() } });
    onFilterChange({ target: { name: "priceMax", value: max.toString() } });
  };

  // Вычисляем начальные значения для слайдера
  const minSliderValue = parseInt(priceRange.min || 0);
  const maxSliderValue = parseInt(priceRange.max || 200000);

  // Гарантируем, что ползунки не будут накладываться друг на друга
  const sliderValues = [
    minSliderValue,
    maxSliderValue > minSliderValue ? maxSliderValue : minSliderValue + 1000,
  ];

  // Преобразуем "any" обратно в пустую строку для фильтра
  const handleYearChange = (name, value) => {
    const finalValue = value === "any" ? "" : value;
    onFilterChange({ target: { name, value: finalValue } });
  };

  // Форматирование цены для отображения
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // Применение фильтров - для мобильной версии
  const applyFilters = () => {
    const params = new URLSearchParams(window.location.search);

    // Обновляем параметры URL
    if (selectedStatus) {
      params.set("status", selectedStatus);
    } else {
      params.delete("status");
    }

    if (priceRange.min) {
      params.set("priceMin", priceRange.min);
    } else {
      params.delete("priceMin");
    }

    if (priceRange.max) {
      params.set("priceMax", priceRange.max);
    } else {
      params.delete("priceMax");
    }

    if (yearRange.min) {
      params.set("yearMin", yearRange.min);
    } else {
      params.delete("yearMin");
    }

    if (yearRange.max) {
      params.set("yearMax", yearRange.max);
    } else {
      params.delete("yearMax");
    }

    // Обновляем URL без перезагрузки страницы
    window.history.pushState({}, "", `${window.location.pathname}?${params}`);

    // Если нужно перезагрузить данные после изменения URL
    // Можно добавить callback или событие для обновления списка аукционов
  };

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
              value=''
              checked={selectedStatus === null || selectedStatus === ""}
              onChange={() =>
                onFilterChange({ target: { name: "status", value: "" } })
              }
              className='rounded border-gray-200'
            />
            <span>Все аукционы</span>
          </label>
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
              value='archived'
              checked={selectedStatus === "archived"}
              onChange={onFilterChange}
              className='rounded border-gray-200'
            />
            <span>Завершенные</span>
          </label>
        </div>

        {/* Индикатор активного фильтра */}
        {selectedStatus && (
          <div className='mt-2 flex items-center text-xs text-muted-foreground'>
            <span>Фильтр активен:</span>
            <span className='ml-1 font-medium text-primary'>
              {selectedStatus === "active" ? "Активные" : "Завершенные"}
            </span>
          </div>
        )}
      </div>

      {/* Линия-разделитель */}
      <div className='h-px bg-border' />

      {/* Ценовой диапазон */}
      <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium'>Ценовой диапазон</h3>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isPriceOpen ? "rotate-180" : ""
                }`}
              />
              <span className='sr-only'>Переключить</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className='space-y-4 pt-2'>
          {/* Показываем текущий диапазон */}
          <div className='flex justify-between items-center'>
            <span className='text-sm font-medium text-muted-foreground'>
              {priceRange.min ? formatPrice(priceRange.min) : "Мин."}
            </span>
            <span className='text-sm font-medium text-muted-foreground'>
              {priceRange.max ? formatPrice(priceRange.max) : "Макс."}
            </span>
          </div>

          {/* Слайдер для цены */}
          <Slider
            defaultValue={[0, 200000]}
            min={0}
            max={200000}
            step={1000}
            value={sliderValues}
            onValueChange={handlePriceSliderChange}
            className='py-4'
          />

          {/* Ручной ввод */}
          <div className='grid grid-cols-2 gap-3 mt-3'>
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
        </CollapsibleContent>
      </Collapsible>

      {/* Линия-разделитель */}
      <div className='h-px bg-border' />

      {/* Год выпуска */}
      <Collapsible open={isYearOpen} onOpenChange={setIsYearOpen}>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium'>Год выпуска</h3>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isYearOpen ? "rotate-180" : ""
                }`}
              />
              <span className='sr-only'>Переключить</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className='space-y-4 pt-2'>
          {/* Селекты для годов */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Select
                value={yearRange.min === "" ? "any" : yearRange.min || "any"}
                onValueChange={(value) => handleYearChange("yearMin", value)}
              >
                <SelectTrigger className='h-9'>
                  <SelectValue placeholder='От' />
                </SelectTrigger>
                <SelectContent className='max-h-[220px] overflow-y-auto'>
                  <SelectItem value='any'>Любой</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={`min-${year}`} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                value={yearRange.max === "" ? "any" : yearRange.max || "any"}
                onValueChange={(value) => handleYearChange("yearMax", value)}
              >
                <SelectTrigger className='h-9'>
                  <SelectValue placeholder='До' />
                </SelectTrigger>
                <SelectContent className='max-h-[220px] overflow-y-auto'>
                  <SelectItem value='any'>Любой</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={`max-${year}`} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Применить фильтры на мобильных */}
      <div className='lg:hidden mt-4'>
        <Button className='w-full' onClick={applyFilters}>
          <Filter className='h-4 w-4 mr-2' />
          Применить фильтры
        </Button>
      </div>
    </div>
  );
}
