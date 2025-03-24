"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CategoryButton from "../ui/CategoryButton";

// Categories for filter buttons
const categories = [
  { name: "Люкс", id: "luxury" },
  { name: "Внедорожники", id: "suv" },
  { name: "Электромобили", id: "electric" },
  { name: "Классика", id: "classic" },
];

export default function SearchSection() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
              Найдите идеальный автомобиль
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Ищите среди тысяч автомобилей, выставленных на аукцион. Фильтруйте
              по марке, модели, году выпуска и многому другому.
            </p>
          </div>
        </div>
        <div className='mx-auto w-full max-w-3xl space-y-4 py-8'>
          <div className='flex w-full max-w-sm items-center space-x-2 mx-auto'>
            <Input
              type='search'
              placeholder='Поиск по марке, модели или ключевому слову'
              className='flex-1'
            />
            <Button type='submit'>
              <Search className='h-4 w-4 mr-2' />
              Поиск
            </Button>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
            {categories.map((category) => (
              <CategoryButton key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
