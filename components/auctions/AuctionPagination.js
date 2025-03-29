"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function AuctionPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Функция для генерации массива номеров страниц с соседними от текущей
  const getPageNumbers = () => {
    // Если страниц меньше или равно 7, показываем все
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Иначе используем логику с соседними страницами
    const pageNumbers = [];

    // Всегда добавляем первую страницу
    pageNumbers.push(1);

    // Определяем соседние страницы (текущая - 1, текущая, текущая + 1)
    const leftNeighbor = Math.max(2, currentPage - 1);
    const rightNeighbor = Math.min(totalPages - 1, currentPage + 1);

    // Добавляем многоточие слева, если нужно
    if (leftNeighbor > 2) {
      pageNumbers.push("...");
    }

    // Добавляем страницы от левого соседа до правого соседа
    for (let i = leftNeighbor; i <= rightNeighbor; i++) {
      pageNumbers.push(i);
    }

    // Добавляем многоточие справа, если нужно
    if (rightNeighbor < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Всегда добавляем последнюю страницу
    pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex justify-center mt-8'>
      <div className='flex items-center space-x-1'>
        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <span className='sr-only'>Предыдущая страница</span>
          <ChevronDown className='h-4 w-4 rotate-90' />
        </Button>

        {pageNumbers.map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className='flex items-center justify-center h-8 px-2 text-muted-foreground'
            >
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              variant='outline'
              size='sm'
              className={`h-8 min-w-8 ${
                pageNum === currentPage
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          ),
        )}

        <Button
          variant='outline'
          size='icon'
          className='h-8 w-8'
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <span className='sr-only'>Следующая страница</span>
          <ChevronDown className='h-4 w-4 -rotate-90' />
        </Button>
      </div>
    </div>
  );
}
