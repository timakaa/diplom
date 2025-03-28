import Layout from "@/components/layout/Layout";
import AuctionsContent from "@/components/auctions/AuctionsContent";

export const metadata = {
  title: "Аукционы | АвтоАукцион",
  description:
    "Просмотрите текущие автомобильные аукционы и сделайте ставку на автомобиль вашей мечты",
};

export default function Auctions() {
  return (
    <Layout>
      <AuctionsContent />
    </Layout>
  );
}
