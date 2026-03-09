import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Toast from "@/components/common/Toast";
import ScrollToTop from "@/components/common/ScrollToTop";
import Hero from "@/components/home/Hero";
import Curation from "@/components/home/Curation";
import CategoryNav from "@/components/home/CategoryNav";
import RegionSection from "@/components/home/RegionSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Curation />
        <CategoryNav />
        <RegionSection />
      </main>
      <Footer />
      <Toast />
      <ScrollToTop />
    </>
  );
}
