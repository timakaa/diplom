import Layout from "@/components/layout/Layout";
import CreateAuctionContent from "@/components/auctions/CreateAuctionContent";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Создать аукцион",
  description: "Создайте новый аукцион на нашей платформе",
};

export default async function CreateAuction() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <Layout>
      <CreateAuctionContent />
    </Layout>
  );
}
