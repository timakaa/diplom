import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
      <div className='container px-4 md:px-6'>
        <div className='grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]'>
          <div className='flex flex-col justify-center space-y-4'>
            <div className='space-y-2'>
              <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none'>
                Найдите автомобиль своей мечты на аукционе
              </h1>
              <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                Откройте для себя эксклюзивные предложения на премиальные
                автомобили. Делайте ставки, выигрывайте и уезжайте на идеальном
                автомобиле.
              </p>
            </div>
            <div className='flex flex-col gap-2 min-[400px]:flex-row'>
              <Link href='/auctions'>
                <Button size='lg' className='px-8'>
                  Просмотр аукционов
                </Button>
              </Link>
            </div>
          </div>
          <div className='relative h-[300px] overflow-hidden rounded-xl lg:h-[400px] xl:h-[500px]'>
            <Image
              src='/intro.jpg'
              width={800}
              height={500}
              alt='Элитный автомобиль на аукционе'
              className='object-cover w-full h-full'
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
