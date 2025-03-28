"use client";

import AuctionCard from "@/components/AuctionCard";
import AuctionFilters from "@/components/auctions/AuctionFilters";
import AuctionPagination from "@/components/auctions/AuctionPagination";
import AuctionSearch from "@/components/auctions/AuctionSearch";
import AuctionResults from "@/components/auctions/AuctionResults";
import { useAuctions } from "@/lib/hooks/useAuctions";
import { useState } from "react";

export default function AuctionsContent() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [yearRange, setYearRange] = useState({ min: "", max: "" });

  const { data, isLoading, error } = useAuctions({
    page,
    limit: 9,
    status: selectedStatus,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    // Здесь можно добавить логику поиска
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedStatus(value);
      setPage(1);
    } else if (name.startsWith("price")) {
      setPriceRange((prev) => ({
        ...prev,
        [name.replace("price", "").toLowerCase()]: value,
      }));
    } else if (name.startsWith("year")) {
      setYearRange((prev) => ({
        ...prev,
        [name.replace("year", "").toLowerCase()]: value,
      }));
    }
  };

  const handleResetFilters = () => {
    setSelectedStatus(null);
    setPriceRange({ min: "", max: "" });
    setYearRange({ min: "", max: "" });
    setPage(1);
  };

  return (
    <>
      {/* Баннер с поиском */}
      <section className='w-full py-8 md:py-12 lg:py-16 bg-muted'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col space-y-4'>
            <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl'>
              Автомобильные аукционы
            </h1>
            <p className='max-w-[900px] text-muted-foreground'>
              Найдите и сделайте ставку на автомобиль вашей мечты среди сотен
              эксклюзивных лотов
            </p>

            <AuctionSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Основная секция с фильтрами и результатами */}
      <section className='w-full py-8 md:py-12'>
        <div className='container px-4 md:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8'>
            {/* Фильтры */}
            <AuctionFilters
              selectedStatus={selectedStatus}
              priceRange={priceRange}
              yearRange={yearRange}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            {/* Результаты */}
            <div className='space-y-6'>
              <AuctionResults data={data} isLoading={isLoading} error={error} />

              {/* Пагинация */}
              {data?.pagination.totalPages > 1 && (
                <AuctionPagination
                  currentPage={page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
