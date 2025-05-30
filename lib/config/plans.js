export const SUBSCRIPTION_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 500000,
    balance: 2000000,
    features: [
      "Доступ к базовым аукционам",
      "Стандартная поддержка",
      "Базовые уведомления",
      "Доступ к истории ставок",
      "Доступ к избранному",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 1500000,
    balance: 8000000,
    features: [
      "Все функции Basic",
      "Приоритетный доступ к аукционам",
      "Расширенные уведомления",
      "Приоритетная поддержка",
      "Аналитика и статистика",
      "Доступ к эксклюзивным аукционам",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 5000000,
    balance: 25000000,
    features: [
      "Все функции Pro",
      "VIP доступ к аукционам",
      "Персональный менеджер",
      "Расширенная аналитика",
      "Эксклюзивные предложения",
      "Приоритетная обработка ставок",
      "Доступ к закрытым аукционам",
    ],
  },
];

// Вспомогательные функции
export function getPlanById(id) {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
}

export function getPlanFeatures(id) {
  const plan = getPlanById(id);
  return plan?.features || [];
}

export function getPlanBalance(id) {
  const plan = getPlanById(id);
  return plan?.balance || 0;
}

export function getPlanPrice(id) {
  const plan = getPlanById(id);
  return plan?.price || 0;
}
