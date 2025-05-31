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
          <DialogTitle>Создание заказа на план</DialogTitle>
          <DialogDescription>
            Вы собираетесь создать заказ на план {planName} за {formattedPrice}{" "}
            в месяц. После подтверждения вы будете перенаправлены на страницу
            оплаты, где сможете завершить покупку с помощью QR-кода.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={isLoading}>
            Отмена
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Создание заказа..." : "Создать заказ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
