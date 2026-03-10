import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import Hero from "@/components/home/Hero";
import Curation from "@/components/home/Curation";
import CategoryNav from "@/components/home/CategoryNav";
import RegionSection from "@/components/home/RegionSection";
import AIRecommendation from "@/components/home/AIRecommendation";
import RecentlyViewed from "@/components/home/RecentlyViewed";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Curation />
        <AIRecommendation />
        <CategoryNav />
        <RegionSection />
        <RecentlyViewed />
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </>
  );
}
