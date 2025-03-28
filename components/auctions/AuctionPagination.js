"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function AuctionPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
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

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
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
        ))}

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
