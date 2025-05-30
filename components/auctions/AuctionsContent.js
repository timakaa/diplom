"use client";

import AuctionCard from "@/components/AuctionCard";
import AuctionFilters from "@/components/auctions/AuctionFilters";
import AuctionPagination from "@/components/auctions/AuctionPagination";
import AuctionSearch from "@/components/auctions/AuctionSearch";
import AuctionResults from "@/components/auctions/AuctionResults";
import { useAuctions } from "@/lib/hooks/useAuctions";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuctionsContentInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализируем состояния на основе URL параметров
  const initialPage = parseInt(searchParams.get("page") || "1");
  const initialStatus = searchParams.get("status") || null;
  const initialPriceMin = searchParams.get("priceMin") || "";
  const initialPriceMax = searchParams.get("priceMax") || "";
  const initialYearMin = searchParams.get("yearMin") || "";
  const initialYearMax = searchParams.get("yearMax") || "";
  const initialSearchQuery = searchParams.get("q") || "";

  const [page, setPage] = useState(initialPage);
  const [inputSearchQuery, setInputSearchQuery] = useState(initialSearchQuery);
  const [appliedSearchQuery, setAppliedSearchQuery] =
    useState(initialSearchQuery);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [priceRange, setPriceRange] = useState({
    min: initialPriceMin,
    max: initialPriceMax,
  });
  const [yearRange, setYearRange] = useState({
    min: initialYearMin,
    max: initialYearMax,
  });

  // Вызов API с обновленными фильтрами
  const { data, isLoading, error } = useAuctions({
    page,
    limit: 9,
    status: selectedStatus,
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    yearMin: yearRange.min,
    yearMax: yearRange.max,
    searchQuery: appliedSearchQuery,
  });

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();

    // Добавляем параметры в URL только если они имеют значение
    if (page > 1) params.set("page", page.toString());
    if (selectedStatus) params.set("status", selectedStatus);
    if (priceRange.min) params.set("priceMin", priceRange.min);
    if (priceRange.max) params.set("priceMax", priceRange.max);
    if (yearRange.min) params.set("yearMin", yearRange.min);
    if (yearRange.max) params.set("yearMax", yearRange.max);
    if (appliedSearchQuery) params.set("q", appliedSearchQuery);

    // Формируем новый URL
    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;

    // Обновляем URL без перезагрузки страницы
    router.push(newUrl, { scroll: false });
  }, [page, selectedStatus, priceRange, yearRange, appliedSearchQuery, router]);

  // Эффект для проверки, есть ли результаты на текущей странице
  useEffect(() => {
    // Если нет данных или они загружаются - не делаем ничего
    if (isLoading || !data) return;

    // Если на текущей странице нет аукционов, но они есть на других страницах
    if (data.auctions.length === 0 && data.pagination.total > 0 && page > 1) {
      // Возвращаемся на первую страницу
      setPage(1);
    }
  }, [data, isLoading, page, setPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearchQuery(inputSearchQuery);
    setPage(1); // Сбрасываем на первую страницу при поиске
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      // Если значение пустое, устанавливаем null (все аукционы)
      if (value === "") {
        setSelectedStatus(null);
      } else {
        // Если выбирается уже активный статус, тоже сбрасываем его на null
        setSelectedStatus((prevStatus) =>
          prevStatus === value ? null : value,
        );
      }
      setPage(1); // Возвращаемся на первую страницу при смене фильтра
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
    setInputSearchQuery("");
    setAppliedSearchQuery("");
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
              searchQuery={inputSearchQuery}
              onSearchChange={setInputSearchQuery}
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

              {/* Пагинация - показываем только если есть результаты и более одной страницы */}
              {data?.auctions?.length > 0 &&
                data?.pagination.totalPages > 1 && (
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

export default function AuctionsContent() {
  return (
    <Suspense fallback={<div>Loading auctions...</div>}>
      <AuctionsContentInner />
    </Suspense>
  );
}
