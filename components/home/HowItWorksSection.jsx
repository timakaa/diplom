import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HowItWorksStep from "../ui/HowItWorksStep";
import StepCard from "../ui/StepCard";
import Link from "next/link";
import { ArrowRightIcon, SearchIcon, GavelIcon, TruckIcon } from "lucide-react";

// Steps data for the how it works section
const steps = [
  {
    number: 1,
    title: "Зарегистрируйте аккаунт",
    description:
      "Создайте бесплатный аккаунт, чтобы начать делать ставки на автомобили. Верификация занимает всего несколько минут.",
  },
  {
    number: 2,
    title: "Просматривайте и исследуйте",
    description:
      "Изучите наш обширный инвентарь с подробной историей автомобилей, отчетами о проверках и фотографиями.",
  },
  {
    number: 3,
    title: "Делайте ставки",
    description:
      "Установите максимальную ставку, и наша система будет автоматически делать ставки за вас до вашего лимита.",
  },
  {
    number: 4,
    title: "Выигрывайте и получайте",
    description:
      "Если вы выиграли, завершите платеж безопасно онлайн и организуйте самовывоз или доставку вашего нового автомобиля.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <div className='inline-block rounded-lg bg-muted px-3 py-1 text-sm'>
              Простой процесс
            </div>
            <h2 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
              Как работает наш автоаукцион
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Мы упростили процесс покупки автомобиля на аукционе, чтобы вы
              могли найти и приобрести автомобиль своей мечты за считанные
              минуты.
            </p>
          </div>
        </div>
        <div className='mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12'>
          <StepCard
            icon={<SearchIcon className='h-12 w-12' />}
            title='Найдите автомобиль'
            description='Просмотрите нашу обширную коллекцию премиальных автомобилей и найдите тот, который соответствует вашим предпочтениям.'
            step='1'
          />
          <StepCard
            icon={<GavelIcon className='h-12 w-12' />}
            title='Сделайте ставку'
            description='Разместите конкурентоспособную ставку на выбранный автомобиль и следите за аукционом в режиме реального времени.'
            step='2'
          />
          <StepCard
            icon={<TruckIcon className='h-12 w-12' />}
            title='Получите доставку'
            description='Выиграли аукцион? Мы организуем безопасную доставку вашего нового автомобиля прямо к вам домой.'
            step='3'
          />
        </div>
        <div className='flex justify-center'>
          <Link href='/how-it-works'>
            <Button variant='outline' size='lg'>
              Узнать больше
              <ArrowRightIcon className='ml-2 h-4 w-4' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
