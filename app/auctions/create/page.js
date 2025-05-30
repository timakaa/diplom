import Layout from "@/components/layout/Layout";
import CreateAuctionContent from "@/components/auctions/CreateAuctionContent";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Создать аукцион | АвтоАукцион",
  description:
    "Создайте новый автомобильный аукцион и продайте свой автомобиль",
};

export default async function CreateAuction() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin?callbackUrl=/auctions/create");
  }

  return (
    <Layout>
      <CreateAuctionContent />
    </Layout>
  );
}
