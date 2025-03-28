"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import PlanCard from "@/components/plans/PlanCard";
import { PlanConfirmationDialog } from "@/components/plans/PlanConfirmationDialog";

export function PlansClient({ plans, currentPlan }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Получаем индекс текущего плана
  const currentPlanIndex = plans.findIndex((plan) => plan.id === currentPlan);

  const handlePlanSelect = async (plan) => {
    // Проверяем, не является ли выбранный план ниже текущего
    const selectedPlanIndex = plans.findIndex((p) => p.id === plan.id);
    if (selectedPlanIndex < currentPlanIndex) {
      toast({
        title: "Невозможно выбрать план",
        description: "Вы не можете выбрать план ниже текущего уровня подписки",
        variant: "destructive",
      });
      return;
    }

    setSelectedPlan(plan);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: selectedPlan.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка при обновлении плана");
      }

      toast({
        title: "Успешно",
        description: "План успешно обновлен",
      });
      setSelectedPlan(null);
      router.refresh();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
        {plans.map((plan) => {
          const planIndex = plans.findIndex((p) => p.id === plan.id);
          const isLowerTier = planIndex < currentPlanIndex;

          return (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={plan.price}
              balance={plan.balance}
              features={plan.features}
              isCurrentPlan={currentPlan === plan.id}
              onSelect={() => handlePlanSelect(plan)}
              isDisabled={isLoading || isLowerTier}
              isLoading={isLoading}
              tooltip={
                isLowerTier ? "Нельзя выбрать план ниже текущего" : undefined
              }
            />
          );
        })}
      </div>

      <PlanConfirmationDialog
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onConfirm={handleConfirm}
        planName={selectedPlan?.name}
        price={selectedPlan?.price}
        isLoading={isLoading}
      />
    </>
  );
}
