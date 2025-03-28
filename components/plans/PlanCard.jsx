"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check } from "lucide-react";

export default function PlanCard({
  name,
  price,
  balance,
  features = [],
  isCurrentPlan = false,
  isDisabled = false,
  onSelect,
  isLoading = false,
  tooltip,
}) {
  const formattedBalance = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(balance);

  const card = (
    <Card
      className={`relative flex flex-col ${isDisabled ? "opacity-60" : ""}`}
    >
      {isCurrentPlan && (
        <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
          <span className='bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full'>
            Текущий план
          </span>
        </div>
      )}
      <CardHeader>
        <h3 className='text-2xl font-bold text-center'>{name}</h3>
        <div className='text-center space-y-1'>
          <p className='text-4xl font-bold'>
            {isLoading ? (
              <span className='inline-block w-24 h-8 bg-muted animate-pulse rounded' />
            ) : price === 0 ? (
              "Бесплатно"
            ) : (
              `${price} ₽`
            )}
          </p>
          <p className='text-sm text-muted-foreground'>в месяц</p>
        </div>
      </CardHeader>
      <CardContent className='space-y-4 flex-grow'>
        <div className='text-center'>
          <p className='text-sm text-muted-foreground'>
            Баланс после активации
          </p>
          <p className='text-xl font-semibold'>
            {isLoading ? (
              <span className='inline-block w-32 h-6 bg-muted animate-pulse rounded' />
            ) : (
              formattedBalance
            )}
          </p>
        </div>
        <ul className='space-y-2'>
          {isLoading ? (
            <>
              <li className='flex items-center gap-2'>
                <span className='inline-block w-4 h-4 bg-muted animate-pulse rounded' />
                <span className='inline-block w-48 h-4 bg-muted animate-pulse rounded' />
              </li>
              <li className='flex items-center gap-2'>
                <span className='inline-block w-4 h-4 bg-muted animate-pulse rounded' />
                <span className='inline-block w-40 h-4 bg-muted animate-pulse rounded' />
              </li>
              <li className='flex items-center gap-2'>
                <span className='inline-block w-4 h-4 bg-muted animate-pulse rounded' />
                <span className='inline-block w-44 h-4 bg-muted animate-pulse rounded' />
              </li>
            </>
          ) : (
            features.map((feature, index) => (
              <li key={index} className='flex items-center gap-2'>
                <Check className='h-4 w-4 text-primary' />
                <span className='text-sm'>{feature}</span>
              </li>
            ))
          )}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className={`w-full ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isDisabled || isCurrentPlan || isLoading}
          onClick={onSelect}
        >
          {isLoading ? (
            <span className='inline-block w-24 h-4 bg-muted animate-pulse rounded' />
          ) : isCurrentPlan ? (
            "Активен"
          ) : isDisabled ? (
            "Недоступно"
          ) : (
            "Выбрать план"
          )}
        </Button>
      </CardFooter>
    </Card>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{card}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
}
