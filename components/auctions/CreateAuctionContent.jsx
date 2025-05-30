"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Calendar, Car, DollarSign, Clock, AlertCircle } from "lucide-react";

export default function CreateAuctionContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    brand: "",
    model: "",
    year: "",
    mileage: "",
    startingPrice: "",
    endDate: "",
    startDate: "",
    imageUrl: "",
  });

  // Car makes for the select dropdown
  const carMakes = [
    "Audi",
    "BMW",
    "Mercedes-Benz",
    "Volkswagen",
    "Toyota",
    "Honda",
    "Nissan",
    "Mazda",
    "Hyundai",
    "Kia",
    "Ford",
    "Chevrolet",
    "Renault",
    "Peugeot",
    "Citroen",
    "Skoda",
    "SEAT",
    "Volvo",
    "Subaru",
    "Mitsubishi",
    "Lexus",
    "Infiniti",
    "Acura",
    "Cadillac",
    "Lincoln",
    "Jaguar",
    "Land Rover",
    "Porsche",
    "Ferrari",
    "Lamborghini",
    "Bentley",
    "Rolls-Royce",
    "Maserati",
    "Alfa Romeo",
    "Fiat",
    "Lada",
    "UAZ",
    "GAZ",
    "ВАЗ",
    "УАЗ",
    "ГАЗ",
  ];

  // Generate years from current year to 1980
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 },
    (_, i) => currentYear - i,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "title",
      "description",
      "brand",
      "model",
      "year",
      "mileage",
      "startingPrice",
      "endDate",
      "startDate",
    ];

    for (const field of required) {
      if (!formData[field]) {
        setError(`Поле "${getFieldLabel(field)}" обязательно для заполнения`);
        return false;
      }
    }

    // Validate year
    const year = parseInt(formData.year);
    if (year < 1980 || year > currentYear) {
      setError("Год выпуска должен быть между 1980 и текущим годом");
      return false;
    }

    // Validate mileage
    const mileage = parseInt(formData.mileage);
    if (mileage < 0 || mileage > 1000000) {
      setError("Пробег должен быть между 0 и 1,000,000 км");
      return false;
    }

    // Validate starting price
    const startingPrice = parseInt(formData.startingPrice);
    if (startingPrice < 1000) {
      setError("Стартовая цена должна быть не менее 1,000 рублей");
      return false;
    }

    // Validate end time
    const endDate = new Date(formData.endDate);
    const startDate = new Date(formData.startDate);
    const now = new Date();
    const minEndTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    if (!formData.startDate || !formData.endDate) {
      setError("Время начала и окончания аукциона обязательны");
      return false;
    }

    if (startDate <= minEndTime) {
      setError("Время начала аукциона должно быть не менее чем через 24 часа");
      return false;
    }

    if (endDate <= startDate) {
      setError("Время окончания должно быть после времени начала");
      return false;
    }

    return true;
  };

  const getFieldLabel = (field) => {
    const labels = {
      title: "Название",
      description: "Описание",
      brand: "Марка",
      model: "Модель",
      year: "Год выпуска",
      mileage: "Пробег",
      startingPrice: "Стартовая цена",
      endDate: "Время окончания",
      startDate: "Время начала",
    };
    return labels[field] || field;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!session) {
      setError("Вы должны быть авторизованы для создания аукциона");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auctions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          brand: formData.brand,
          model: formData.model,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          startingPrice: parseInt(formData.startingPrice),
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          imageUrl: formData.imageUrl || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при создании аукциона");
      }

      const responseData = await response.json();
      router.push(`/auctions/${responseData.auction.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date for start/end time (24 hours from now)
  const getMinEndTime = () => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    return minTime.toISOString().slice(0, 16); // Format for datetime-local input
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl mb-2'>
          Создать аукцион
        </h1>
        <p className='text-muted-foreground'>
          Заполните информацию о вашем автомобиле для создания аукциона
        </p>
      </div>

      {error && (
        <Alert variant='destructive' className='mb-6'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className='space-y-8'>
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Car className='h-5 w-5' />
              Основная информация
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium mb-2'>
                Название аукциона *
              </label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleInputChange}
                placeholder='Например: BMW X5 2020 года в отличном состоянии'
                required
              />
            </div>

            <div>
              <label
                htmlFor='description'
                className='block text-sm font-medium mb-2'
              >
                Описание *
              </label>
              <Textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                placeholder='Подробное описание автомобиля, его состояния, особенностей...'
                rows={4}
                required
              />
            </div>

            <div>
              <label
                htmlFor='imageUrl'
                className='block text-sm font-medium mb-2'
              >
                URL изображения
                <span className='text-sm text-muted-foreground ml-1'>
                  (необязательно)
                </span>
              </label>
              <Input
                id='imageUrl'
                name='imageUrl'
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder='https://example.com/car-image.jpg'
                type='url'
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card>
          <CardHeader>
            <CardTitle>Характеристики автомобиля</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='brand'
                  className='block text-sm font-medium mb-2'
                >
                  Марка *
                </label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleSelectChange("brand", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите марку' />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor='model'
                  className='block text-sm font-medium mb-2'
                >
                  Модель *
                </label>
                <Input
                  id='model'
                  name='model'
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder='Например: X5, Camry, Golf'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='year'
                  className='block text-sm font-medium mb-2'
                >
                  Год выпуска *
                </label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleSelectChange("year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Выберите год' />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px]'>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor='mileage'
                  className='block text-sm font-medium mb-2'
                >
                  Пробег (км) *
                </label>
                <Input
                  id='mileage'
                  name='mileage'
                  type='number'
                  value={formData.mileage}
                  onChange={handleInputChange}
                  placeholder='Например: 50000'
                  min='0'
                  max='1000000'
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing and Timing */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <DollarSign className='h-5 w-5' />
              Цена и время
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='startingPrice'
                  className='block text-sm font-medium mb-2'
                >
                  Стартовая цена (₽) *
                </label>
                <Input
                  id='startingPrice'
                  name='startingPrice'
                  type='number'
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  placeholder='Например: 500000'
                  min='1000'
                  required
                />
              </div>

              <div>
                <label
                  htmlFor='startDate'
                  className='block text-sm font-medium mb-2'
                >
                  <Clock className='h-4 w-4 inline mr-1' />
                  Время начала аукциона *
                </label>
                <Input
                  id='startDate'
                  name='startDate'
                  type='datetime-local'
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={getMinEndTime()}
                  required
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  Аукцион должен начаться не раньше чем через 24 часа
                </p>
              </div>

              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium mb-2'
                >
                  <Clock className='h-4 w-4 inline mr-1' />
                  Время окончания аукциона *
                </label>
                <Input
                  id='endDate'
                  name='endDate'
                  type='datetime-local'
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={getMinEndTime()}
                  required
                />
                <p className='text-sm text-muted-foreground mt-1'>
                  Время окончания должно быть после времени начала
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='min-w-[150px]'
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className='mr-2 h-4 w-4' />
                Создание...
              </>
            ) : (
              "Создать аукцион"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
