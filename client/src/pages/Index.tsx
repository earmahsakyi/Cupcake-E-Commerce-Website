import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
// import FeaturedCakes from "@/components/FeaturedCakes";
import FeaturedSrcCakes from "@/components/SrcCakes";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedSrcCakes />
      <WhyChooseUs />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
};

export default Index;
