import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Layout from "@/components/layout/Layout";
import { SUBSCRIPTION_PLANS } from "@/lib/config/plans";
import { PlansClient } from "./PlansClient";
import { redirect } from "next/navigation";

export default async function PlansPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/plans");
  }

  return (
    <Layout>
      <div className='container py-8 md:py-12'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold mb-4'>Тарифные планы</h1>
          <p className='text-muted-foreground max-w-2xl mx-auto'>
            Выберите подходящий план подписки для доступа к расширенному
            функционалу
          </p>
        </div>

        <PlansClient
          plans={SUBSCRIPTION_PLANS}
          currentPlan={session.user.plan}
        />
      </div>
    </Layout>
  );
}
