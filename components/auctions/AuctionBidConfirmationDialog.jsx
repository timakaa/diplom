import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AuctionBidConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  bidAmount,
  auction,
  isSubmitting,
}) {
  // Проверяем, что значения корректны и являются числами
  const currentPrice = Math.floor(parseInt(auction?.currentPrice || 0));
  const amount = Math.floor(parseInt(bidAmount) || 0);
  const difference = Math.max(0, amount - currentPrice);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isSubmitting && onClose(!open)}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Подтвердите ставку</DialogTitle>
          <DialogDescription>
            Вы собираетесь сделать ставку в аукционе "{auction?.title}"
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='flex items-center justify-between py-2'>
            <span className='text-muted-foreground'>Текущая цена:</span>
            <span className='font-medium'>{formatPrice(currentPrice)}</span>
          </div>
          <div className='flex items-center justify-between py-2'>
            <span className='text-muted-foreground'>Ваша ставка:</span>
            <span className='font-semibold text-lg'>{formatPrice(amount)}</span>
          </div>
          <div className='flex items-center justify-between py-2'>
            <span className='text-muted-foreground'>Повышение:</span>
            <span className='text-green-600 font-medium'>
              +{formatPrice(difference)}
            </span>
          </div>

          <div className='mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex gap-2'>
            <AlertCircle className='h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5' />
            <div className='text-sm text-amber-800'>
              <p>После подтверждения ставки, отменить ее будет невозможно.</p>
              <p className='mt-1'>
                Сумма ставки будет заблокирована на вашем балансе до завершения
                аукциона.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className='flex flex-col sm:flex-row sm:justify-between gap-2'>
          <Button
            variant='outline'
            onClick={() => onClose(false)}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting} className='gap-2'>
            {isSubmitting ? (
              <>
                Отправка
                <LoadingSpinner />
              </>
            ) : (
              <>
                Подтвердить ставку
                <Check className='h-4 w-4' />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
