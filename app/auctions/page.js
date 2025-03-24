import Layout from "@/components/layout/Layout";
import Image from "next/image";
import {
  Search,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuctionCard from "@/components/AuctionCard";

export const metadata = {
  title: "Аукционы | АвтоАукцион",
  description:
    "Просмотрите текущие автомобильные аукционы и сделайте ставку на автомобиль вашей мечты",
};

// Моковые данные для демонстрации
const mockAuctions = [
  {
    id: 1,
    title: "2021 Мерседес-Бенц GLE 450",
    price: "4 750 000 ₽",
    description: "32 800 км • Автомат • 4MATIC • AMG Line",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "8ч 25м осталось",
    bids: 18,
    ending: true,
  },
  {
    id: 2,
    title: "2019 BMW X5 40i",
    price: "3 950 000 ₽",
    description: "45 300 км • Автомат • xDrive • M Sport",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "11ч 50м осталось",
    bids: 15,
    ending: true,
  },
  {
    id: 3,
    title: "2022 Ауди Q7 55 TFSI",
    price: "5 200 000 ₽",
    description: "18 400 км • Автомат • quattro • S-line",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "1д 3ч осталось",
    bids: 21,
    ending: false,
  },
  {
    id: 4,
    title: "2020 Лексус RX 350",
    price: "3 680 000 ₽",
    description: "37 900 км • Автомат • AWD • F Sport",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "1д 5ч осталось",
    bids: 12,
    ending: false,
  },
  {
    id: 5,
    title: "2021 Порше Кайен",
    price: "6 450 000 ₽",
    description: "24 600 км • Автомат • AWD • Sport Chrono",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "2д 9ч осталось",
    bids: 25,
    ending: false,
  },
  {
    id: 6,
    title: "2019 Тесла Модель S",
    price: "4 200 000 ₽",
    description: "42 100 км • Автомат • Dual Motor • Performance",
    image: "/placeholder.svg?height=200&width=400",
    timeLeft: "6ч 15м осталось",
    bids: 28,
    ending: true,
  },
];

// Моковые данные для категорий фильтрации
const categories = [
  { name: "Все", count: 248 },
  { name: "Седаны", count: 72 },
  { name: "Внедорожники", count: 86 },
  { name: "Спорткары", count: 24 },
  { name: "Электромобили", count: 31 },
  { name: "Классика", count: 17 },
  { name: "Люкс", count: 43 },
];

// Моковые данные для марок автомобилей
const brands = [
  { name: "Audi", count: 25 },
  { name: "BMW", count: 32 },
  { name: "Mercedes-Benz", count: 38 },
  { name: "Porsche", count: 19 },
  { name: "Tesla", count: 17 },
  { name: "Lexus", count: 23 },
  { name: "Toyota", count: 29 },
];

export default function Auctions() {
  return (
    <Layout>
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

            <div className='flex max-w-md items-center space-x-2'>
              <div className='relative flex-1'>
                <div className='absolute inset-y-0 left-3 flex items-center pointer-events-none'>
                  <Search className='h-4 w-4 text-muted-foreground' />
                </div>
                <Input
                  type='search'
                  placeholder='Поиск по марке, модели или году'
                  className='flex-1 pl-10 pr-4 py-6 text-base rounded-xl border-primary/10 shadow-sm 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200'
                />
              </div>
              <Button
                type='submit'
                className='py-6 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200'
              >
                Найти
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Основная секция с фильтрами и результатами */}
      <section className='w-full py-8 md:py-12'>
        <div className='container px-4 md:px-6'>
          <div className='grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8'>
            {/* Фильтры */}
            <div className='space-y-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Фильтры</h2>
                <Button variant='ghost' size='sm' className='h-8 text-sm'>
                  Сбросить все
                </Button>
              </div>

              {/* Категории */}
              <div className='space-y-3'>
                <h3 className='text-sm font-medium'>Категории</h3>
                <div className='space-y-2'>
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className='flex items-center justify-between'
                    >
                      <label className='flex items-center space-x-2 text-sm'>
                        <input
                          type='checkbox'
                          className='rounded border-gray-200'
                        />
                        <span>{category.name}</span>
                      </label>
                      <span className='text-xs text-muted-foreground'>
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Линия-разделитель */}
              <div className='h-px bg-border' />

              {/* Марки автомобилей */}
              <div className='space-y-3'>
                <h3 className='text-sm font-medium'>Марки</h3>
                <div className='space-y-2'>
                  {brands.map((brand) => (
                    <div
                      key={brand.name}
                      className='flex items-center justify-between'
                    >
                      <label className='flex items-center space-x-2 text-sm'>
                        <input
                          type='checkbox'
                          className='rounded border-gray-200'
                        />
                        <span>{brand.name}</span>
                      </label>
                      <span className='text-xs text-muted-foreground'>
                        {brand.count}
                      </span>
                    </div>
                  ))}
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
                      placeholder='Мин.'
                      className='h-9 text-sm'
                    />
                  </div>
                  <div>
                    <Input
                      type='number'
                      placeholder='Макс.'
                      className='h-9 text-sm'
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
                      placeholder='От'
                      className='h-9 text-sm'
                    />
                  </div>
                  <div>
                    <Input
                      type='number'
                      placeholder='До'
                      className='h-9 text-sm'
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

            {/* Результаты */}
            <div className='space-y-6'>
              {/* Сортировка и счетчик */}
              <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>
                    Найдено 248 аукционов
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <Button variant='outline' size='sm' className='h-8 gap-1'>
                    <SlidersHorizontal className='h-3.5 w-3.5' />
                    <span>Сортировка</span>
                    <ChevronDown className='h-3.5 w-3.5 ml-1' />
                  </Button>
                  <Button variant='outline' size='sm' className='h-8 gap-1'>
                    <Clock className='h-3.5 w-3.5' />
                    <span>Скоро закончатся</span>
                  </Button>
                </div>
              </div>

              {/* Сетка аукционов */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {mockAuctions.map((auction) => (
                  <div key={auction.id} className='auction-card'>
                    <AuctionCard />
                  </div>
                ))}
              </div>

              {/* Пагинация */}
              <div className='flex justify-center mt-8'>
                <div className='flex items-center space-x-1'>
                  <Button variant='outline' size='icon' className='h-8 w-8'>
                    <span className='sr-only'>Предыдущая страница</span>
                    <ChevronDown className='h-4 w-4 rotate-90' />
                  </Button>
                  <Button variant='outline' size='sm' className='h-8 min-w-8'>
                    1
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 min-w-8 bg-primary text-primary-foreground'
                  >
                    2
                  </Button>
                  <Button variant='outline' size='sm' className='h-8 min-w-8'>
                    3
                  </Button>
                  <span className='px-2 text-sm text-muted-foreground'>
                    ...
                  </span>
                  <Button variant='outline' size='sm' className='h-8 min-w-8'>
                    12
                  </Button>
                  <Button variant='outline' size='icon' className='h-8 w-8'>
                    <span className='sr-only'>Следующая страница</span>
                    <ChevronDown className='h-4 w-4 -rotate-90' />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
