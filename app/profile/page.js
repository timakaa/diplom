"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileOverview from "@/components/profile/ProfileOverview";
import ProfileBids from "@/components/profile/ProfileBids";
import ProfileFavorites from "@/components/profile/ProfileFavorites";
import ProfileSettings from "@/components/profile/ProfileSettings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Моковые данные для истории ставок
const biddingHistory = [
  {
    id: 1,
    date: "21 март 2024",
    time: "14:35",
    car: "BMW X5 40i 2019",
    amount: "3 950 000 ₽",
    status: "Активна",
  },
  {
    id: 2,
    date: "18 март 2024",
    time: "09:20",
    car: "Audi Q7 55 TFSI 2022",
    amount: "5 100 000 ₽",
    status: "Перебита",
  },
  {
    id: 3,
    date: "15 март 2024",
    time: "16:45",
    car: "Mercedes-Benz GLE 450 2021",
    amount: "4 700 000 ₽",
    status: "Выиграна",
  },
];

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  // Получаем избранные аукционы
  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const response = await fetch("/api/favorites");
      if (!response.ok) throw new Error("Ошибка загрузки избранного");
      return response.json();
    },
    enabled: !!session?.user,
  });

  const favoriteAuctions = favoritesData?.favorites || [];

  // Редирект на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || isLoadingFavorites) {
    return (
      <Layout>
        <div className='container py-12'>
          <div className='flex justify-center items-center min-h-[60vh]'>
            <p className='text-lg text-muted-foreground'>Загрузка профиля...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return null; // Страница будет перенаправлена при монтировании
  }

  return (
    <Layout>
      <div className='container py-8 md:py-12'>
        {/* Шапка профиля */}
        <ProfileHeader user={session.user} />

        {/* Вкладки профиля */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='mb-6 flex w-full justify-between'>
            <TabsTrigger
              value='overview'
              className='px-2 py-1.5 text-xs sm:text-sm sm:px-3 flex-1'
            >
              Обзор
            </TabsTrigger>
            <TabsTrigger
              value='bids'
              className='px-2 py-1.5 text-xs sm:text-sm sm:px-3 flex-1'
            >
              Ставки
            </TabsTrigger>
            <TabsTrigger
              value='favorites'
              className='px-2 py-1.5 text-xs sm:text-sm sm:px-3 flex-1'
            >
              Избранное
            </TabsTrigger>
            <TabsTrigger
              value='settings'
              className='px-2 py-1.5 text-xs sm:text-sm sm:px-3 flex-1'
            >
              Настройки
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview'>
            <ProfileOverview
              biddingHistory={biddingHistory}
              favoriteAuctions={favoriteAuctions}
              onTabChange={setActiveTab}
              user={session.user}
            />
          </TabsContent>

          <TabsContent value='bids'>
            <ProfileBids biddingHistory={biddingHistory} />
          </TabsContent>

          <TabsContent value='favorites'>
            <ProfileFavorites favoriteAuctions={favoriteAuctions} />
          </TabsContent>

          <TabsContent value='settings'>
            <ProfileSettings user={session.user} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
