import Layout from "@/components/layout/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import SearchSection from "@/components/home/SearchSection";
import FeaturedAuctions from "@/components/home/FeaturedAuctions";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

export const metadata = {
  title: "АвтоАукцион",
  description:
    "АвтоАукцион - это онлайн-площадка для покупки и продажи автомобилей. Мы предлагаем широкий выбор автомобилей от разных производителей и моделей.",
};

export default function Home() {
  return (
    <Layout>
      <HeroBanner />
      <SearchSection />
      <FeaturedAuctions />
      <HowItWorksSection />
      <WhyChooseUsSection />
    </Layout>
  );
}
