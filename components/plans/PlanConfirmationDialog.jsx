"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PlanConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  planName,
  price,
  isLoading,
}) {
  const formattedPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Подтверждение выбора плана</DialogTitle>
          <DialogDescription>
            Вы уверены, что хотите выбрать план {planName} за {formattedPrice} в
            месяц? С вашего баланса будет списана соответствующая сумма.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Подтверждение..." : "Подтвердить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
