"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone } from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";

export function QRPaymentDialog({
  isOpen,
  onClose,
  onContinue,
  planName,
  price,
  isLoading,
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const formattedPrice = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
  }).format(price);

  // Generate QR code when dialog opens
  useEffect(() => {
    if (isOpen && !qrCodeUrl) {
      const paymentUrl = `${window.location.origin}/payment-success`;
      QRCode.toDataURL(paymentUrl, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [isOpen, qrCodeUrl]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setPaymentCompleted(false);
      setQrCodeUrl("");
    }
  }, [isOpen]);

  const handleContinue = () => {
    if (!paymentCompleted) {
      // First click - show payment completed state and process payment
      setPaymentCompleted(true);
      onContinue();
    } else {
      // Second click - close the dialog
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Оплата плана {planName}</DialogTitle>
          <DialogDescription>
            Завершите оплату {formattedPrice} с помощью QR-кода ниже
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col items-center space-y-6 py-4'>
          {!paymentCompleted ? (
            <>
              {/* QR Code */}
              <div className='bg-white p-4 rounded-lg border-2 border-gray-200'>
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt='QR-код для оплаты'
                    className='w-48 h-48'
                  />
                ) : (
                  <div className='w-48 h-48 bg-gray-100 animate-pulse rounded flex items-center justify-center'>
                    <span className='text-gray-500'>Генерация QR...</span>
                  </div>
                )}
              </div>

              {/* SBP Logo */}
              <Image
                src='/sbp-logo.png'
                alt='SBP Logo'
                width={40}
                height={40}
                className='rounded-full'
              />

              {/* Instructions */}
              <div className='text-center space-y-2'>
                <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                  <Smartphone className='h-4 w-4' />
                  <span>Отсканируйте мобильным устройством</span>
                </div>
                <p className='text-xs text-muted-foreground max-w-sm'>
                  Отсканируйте QR-код камерой телефона или приложением для
                  оплаты, чтобы завершить транзакцию
                </p>
              </div>
            </>
          ) : (
            /* Payment completed state */
            <div className='text-center space-y-4'>
              <CheckCircle className='h-16 w-16 text-green-500 mx-auto' />
              <div>
                <h3 className='text-lg font-semibold text-green-700'>
                  Оплата завершена!
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Обработка обновления плана...
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className='flex flex-col sm:flex-row gap-2'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='w-full sm:w-auto'
          >
            Отмена
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className='w-full sm:w-auto'
          >
            {isLoading
              ? "Обработка..."
              : paymentCompleted
              ? "Готово"
              : "Продолжить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
