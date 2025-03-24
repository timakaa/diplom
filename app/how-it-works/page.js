import Layout from "@/components/layout/Layout";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HowItWorksStep from "@/components/ui/HowItWorksStep";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

// Шаги процесса аукциона
const steps = [
  {
    number: 1,
    title: "Зарегистрируйте аккаунт",
    description:
      "Создайте бесплатный аккаунт, чтобы начать делать ставки на автомобили. Верификация занимает всего несколько минут. Для подтверждения личности вам потребуется действующий адрес электронной почты и номер телефона.",
  },
  {
    number: 2,
    title: "Просматривайте и исследуйте",
    description:
      "Изучите наш обширный инвентарь с подробной историей автомобилей, отчетами о проверках и фотографиями. Каждый автомобиль проходит тщательную проверку, а результаты доступны для всех участников аукциона.",
  },
  {
    number: 3,
    title: "Делайте ставки",
    description:
      "Установите максимальную ставку, и наша система будет автоматически делать ставки за вас до вашего лимита. Вы получите уведомление, если ваша ставка будет перебита, чтобы у вас была возможность сделать новую.",
  },
  {
    number: 4,
    title: "Выигрывайте и получайте",
    description:
      "Если вы выиграли, завершите платеж безопасно онлайн и организуйте самовывоз или доставку вашего нового автомобиля. Мы предлагаем различные варианты доставки во все регионы России.",
  },
];

// Часто задаваемые вопросы
const faqs = [
  {
    question: "Какие комиссии взимаются за участие в аукционе?",
    answer:
      "Регистрация и просмотр лотов на нашей платформе абсолютно бесплатны. Комиссия в размере 5% от финальной цены взимается только с победителя аукциона. Эта комиссия включает в себя все сборы за обработку транзакции.",
  },
  {
    question: "Можно ли осмотреть автомобиль перед аукционом?",
    answer:
      "Да, для большинства автомобилей мы предлагаем возможность предварительного осмотра. Вы можете записаться на осмотр через личный кабинет или связаться с нашей службой поддержки для организации визита.",
  },
  {
    question:
      "Что делать, если я выиграл аукцион, но передумал покупать автомобиль?",
    answer:
      "При отказе от покупки после выигрыша взимается штраф в размере 10% от финальной ставки. Мы рекомендуем тщательно изучать все документы и информацию об автомобиле перед участием в аукционе.",
  },
  {
    question: "Как организована доставка автомобиля после покупки?",
    answer:
      "После оплаты вы можете выбрать самовывоз или воспользоваться нашими услугами доставки. Мы сотрудничаем с надежными транспортными компаниями, которые доставят ваш автомобиль в любой регион России. Стоимость доставки рассчитывается индивидуально.",
  },
  {
    question: "Предоставляете ли вы гарантию на приобретенные автомобили?",
    answer:
      "Все автомобили проходят техническую проверку перед выставлением на аукцион. Мы предоставляем подробный отчет о состоянии каждого лота. На отдельные категории автомобилей может распространяться остаточная гарантия производителя.",
  },
];

export const metadata = {
  title: "Как это работает | АвтоАукцион",
  description:
    "Узнайте, как работает наш автомобильный аукцион: от регистрации до получения вашего нового автомобиля",
};

export default function HowItWorks() {
  return (
    <Layout>
      {/* Главный баннер */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
        <div className='container px-4 md:px-6'>
          <div className='grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]'>
            <div className='flex flex-col justify-center space-y-4'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-5xl'>
                  Как работает автомобильный аукцион
                </h1>
                <p className='max-w-[600px] text-muted-foreground md:text-xl'>
                  Простой и прозрачный процесс покупки автомобиля вашей мечты на
                  аукционе. Разберем каждый шаг подробно.
                </p>
              </div>
            </div>
            <div className='relative h-[300px] overflow-hidden rounded-xl lg:h-[400px]'>
              <Image
                src='/placeholder.svg?height=400&width=500'
                width={500}
                height={400}
                alt='Процесс автомобильного аукциона'
                className='object-cover w-full h-full'
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Подробный процесс аукциона */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                Пошаговый процесс
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Наш аукционный процесс разработан, чтобы сделать покупку
                автомобиля максимально простой и прозрачной.
              </p>
            </div>
          </div>

          <div className='grid gap-12 md:grid-cols-2'>
            <div className='space-y-8'>
              {steps.map((step) => (
                <HowItWorksStep
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </div>

            <div className='flex flex-col justify-center space-y-6'>
              <div className='relative h-[300px] overflow-hidden rounded-xl mb-6'>
                <Image
                  src='/placeholder.svg?height=300&width=400'
                  width={400}
                  height={300}
                  alt='Покупка автомобиля на аукционе'
                  className='object-cover w-full h-full'
                />
              </div>
              <div className='bg-primary/5 p-6 rounded-lg border border-primary/10'>
                <h3 className='text-xl font-bold mb-4'>
                  Преимущества нашего аукциона
                </h3>
                <ul className='space-y-3'>
                  <li className='flex items-start gap-2'>
                    <ChevronRight className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>
                      Полная прозрачность истории и состояния автомобилей
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <ChevronRight className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>Гарантированная юридическая чистота всех сделок</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <ChevronRight className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>
                      Возможность делать ставки онлайн из любой точки России
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <ChevronRight className='h-5 w-5 text-primary shrink-0 mt-0.5' />
                    <span>
                      Профессиональная поддержка на всех этапах сделки
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Часто задаваемые вопросы */}
      <section className='w-full py-12 md:py-24 lg:py-32 bg-muted/40'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center mb-12'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                Часто задаваемые вопросы
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Ответы на популярные вопросы о процессе аукциона и покупке
                автомобилей.
              </p>
            </div>
          </div>

          <div className='mx-auto max-w-3xl'>
            <Accordion type='single' collapsible className='w-full'>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className='text-left'>
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className='flex justify-center mt-12'>
            <Link href='/auth/register'>
              <Button size='lg' className='gap-2'>
                Регистрация на аукционе
                <ChevronRight className='h-4 w-4' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Видео инструкция */}
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center mb-10'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
                Видео-инструкция
              </h2>
              <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Посмотрите короткое видео о том, как пользоваться нашей
                платформой
              </p>
            </div>
          </div>

          <div className='mx-auto max-w-4xl aspect-video bg-muted/90 rounded-xl flex items-center justify-center'>
            <div className='text-center'>
              <p className='text-muted-foreground mb-4'>Видео демонстрация</p>
              <Button variant='outline'>Воспроизвести видео</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='card border bg-muted dark:bg-muted/90 rounded-lg shadow-sm my-8 md:my-16'>
        <div className='container px-4 py-12 md:px-6 md:py-16'>
          <div className='flex flex-col items-center justify-center space-y-4 text-center'>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl'>
                Готовы начать торги?
              </h2>
              <p className='mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
                Присоединяйтесь к тысячам коллекционеров и энтузиастов
                автомобилей, которые уже находят и покупают свои автомобили
                мечты через нашу платформу.
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
        </div>
      </section>
    </Layout>
  );
}
