import { Award, Users, Clock } from "lucide-react";
import FeatureCard from "../ui/FeatureCard";

// Features data
const features = [
  {
    icon: <Award className='h-8 w-8 text-primary' />,
    title: "Гарантия качества",
    description:
      "Каждый автомобиль проходит тщательный процесс проверки с доступными подробными отчетами.",
  },
  {
    icon: <Users className='h-8 w-8 text-primary' />,
    title: "Экспертная поддержка",
    description:
      "Наша команда автомобильных экспертов готова ответить на вопросы и предоставить руководство.",
  },
  {
    icon: <Clock className='h-8 w-8 text-primary' />,
    title: "Безопасные транзакции",
    description:
      "Наша защищенная платформа обеспечивает безопасные ставки и обработку платежей для вашего спокойствия.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-muted'>
      <div className='container px-4 md:px-6'>
        <div className='flex flex-col items-center justify-center space-y-4 text-center'>
          <div className='space-y-2'>
            <h2 className='text-3xl font-bold tracking-tighter md:text-4xl'>
              Почему выбирают нас
            </h2>
            <p className='max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed'>
              Мы стремимся обеспечить лучший опыт автомобильного аукциона с
              прозрачностью и доверием.
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 mt-8'>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
