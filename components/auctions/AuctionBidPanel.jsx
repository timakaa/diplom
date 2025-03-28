import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, AlertCircle, ArrowUp, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useUserBidForAuction } from "@/lib/hooks/useUserBidForAuction";
import AuctionBidConfirmationDialog from "./AuctionBidConfirmationDialog";

export default function AuctionBidPanel({ auction, timeLeft, onBidSubmit }) {
  const [bidAmount, setBidAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [validatedAmount, setValidatedAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Получаем информацию о ставке пользователя для этого аукциона
  const {
    data: userBid,
    isLoading: isLoadingBid,
    refetch: refetchUserBid,
  } = useUserBidForAuction(auction?.id);

  const hasUserBid = !!userBid;
  const isOutbid = userBid?.status === "outbid";
  const isCurrentWinner = userBid?.status === "active";

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  // Обработка ввода, оставляем только цифры
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Удаляем все нецифровые символы, оставляем только числа
    const numericValue = value.replace(/[^\d]/g, "");
    setBidAmount(numericValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseInt(bidAmount, 10);

    // Валидация ставки перед открытием модального окна
    if (onBidSubmit(amount) === false) {
      // Валидация не пройдена, ничего не делаем
      return;
    }

    // Если валидация пройдена, сохраняем сумму и открываем модальное окно
    setValidatedAmount(amount);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmBid = async () => {
    setIsSubmitting(true);
    try {
      const result = await onBidSubmit(validatedAmount, true); // Передаем флаг "подтверждено" = true
      if (result) {
        setIsDialogOpen(false);
        setBidAmount(""); // Очищаем поле ввода только если ставка успешна
        // Обновляем информацию о ставке пользователя
        refetchUserBid();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Минимальная ставка в виде целого числа
  const minBid = Math.floor(parseInt(auction.currentPrice) + 1000);

  // Автоматически предлагаем минимальную ставку
  const suggestedBid = minBid;

  // Форматируем числа как целые (без копеек)
  const formatNumberRub = (value) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(Math.floor(value));
  };

  return (
    <div className='lg:col-span-1'>
      <div className='sticky top-[98px] space-y-6 p-6 border rounded-lg bg-card'>
        <div className='space-y-2'>
          <h2 className='text-xl font-semibold'>Текущая цена</h2>
          <p className='text-3xl font-bold'>
            {formatPrice(Math.floor(parseInt(auction.currentPrice)))}
          </p>
        </div>

        <TimeLeftInfo timeLeft={timeLeft} />

        {isLoadingBid ? (
          <div className='flex justify-center py-4'>
            <LoadingSpinner size='lg' />
          </div>
        ) : (
          <>
            {/* Показываем статус ставки пользователя, если она есть */}
            {hasUserBid && (
              <BidStatusAlert
                userBid={userBid}
                isOutbid={isOutbid}
                isCurrentWinner={isCurrentWinner}
                formatPrice={formatPrice}
              />
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <label
                  htmlFor='bidAmount'
                  className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {hasUserBid ? "Повысить ставку" : "Ваша ставка"}
                </label>
                <div className='flex space-x-2'>
                  <Input
                    id='bidAmount'
                    type='text'
                    inputMode='numeric'
                    placeholder='Введите сумму ставки'
                    value={bidAmount}
                    onChange={handleInputChange}
                    className='flex-1'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setBidAmount(suggestedBid.toString())}
                    className='whitespace-nowrap'
                  >
                    Мин: {formatNumberRub(suggestedBid)} ₽
                  </Button>
                </div>
              </div>
              <Button type='submit' className='w-full gap-2'>
                {hasUserBid ? (
                  <>
                    Повысить ставку
                    <ArrowUp className='h-4 w-4' />
                  </>
                ) : (
                  "Сделать ставку"
                )}
              </Button>
            </form>
          </>
        )}

        <BidRules />
      </div>

      <AuctionBidConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleConfirmBid}
        bidAmount={validatedAmount}
        auction={auction}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function BidStatusAlert({ userBid, isOutbid, isCurrentWinner, formatPrice }) {
  if (isOutbid) {
    return (
      <Alert
        variant='destructive'
        className='bg-red-50 text-red-800 border-red-200'
      >
        <AlertCircle className='h-4 w-4' />
        <AlertTitle>Ваша ставка перебита!</AlertTitle>
        <AlertDescription>
          Ваша ставка {formatPrice(userBid.amount)} была перебита другим
          участником. Сделайте новую ставку, чтобы вернуться в игру.
        </AlertDescription>
      </Alert>
    );
  }

  if (isCurrentWinner) {
    return (
      <Alert
        variant='default'
        className='bg-green-50 text-green-800 border-green-200'
      >
        <ShieldCheck className='h-4 w-4' />
        <AlertTitle>Ваша ставка лидирует!</AlertTitle>
        <AlertDescription>
          Вы лидируете с суммой {formatPrice(userBid.amount)}. Вы можете
          повысить ставку, чтобы увеличить шансы на победу.
        </AlertDescription>
      </Alert>
    );
  }

  // Для других статусов (EXPIRED, WON и т.д.) показываем нейтральное сообщение
  return (
    <Alert
      variant='default'
      className='bg-gray-800 text-gray-100 border-gray-700'
    >
      <AlertCircle className='h-4 w-4 text-gray-300' />
      <AlertTitle>Ваша предыдущая ставка</AlertTitle>
      <AlertDescription>
        Ваша последняя ставка на этот аукцион составила{" "}
        {formatPrice(userBid.amount)}.
        {userBid.status === "WON"
          ? " Поздравляем! Вы выиграли этот аукцион."
          : " Вы можете сделать новую ставку."}
      </AlertDescription>
    </Alert>
  );
}

function TimeLeftInfo({ timeLeft }) {
  return (
    <div className='space-y-2'>
      <h3 className='text-sm font-medium'>Осталось времени</h3>
      <div className='flex items-center gap-2 text-muted-foreground'>
        <Clock className='h-4 w-4' />
        <span>{timeLeft}</span>
      </div>
    </div>
  );
}

function BidRules() {
  return (
    <div className='text-sm text-muted-foreground'>
      <p>Минимальный шаг ставки: 1 000 ₽</p>
      <p>Ставка не может быть меньше текущей цены</p>
    </div>
  );
}
