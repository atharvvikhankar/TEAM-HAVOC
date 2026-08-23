import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowWeWork from "@/components/HowWeWork";
import Team from "@/components/Team";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="flex-grow overflow-x-hidden">
        <Hero />
        <HowWeWork />
        <Team />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
