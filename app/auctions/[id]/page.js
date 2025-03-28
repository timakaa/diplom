import Layout from "@/components/layout/Layout";
import AuctionDetails from "@/components/auctions/AuctionDetails";

export const metadata = {
  title: "Аукцион | АвтоАукцион",
  description: "Подробная информация об аукционе",
};

export default function AuctionPage({ params }) {
  return (
    <Layout>
      <AuctionDetails id={params.id} />
    </Layout>
  );
}
