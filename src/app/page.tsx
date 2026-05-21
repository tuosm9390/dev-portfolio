import ContactSection from "@/components/home/ContactSection";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import HeroSection from "@/components/home/HeroSection";
import ProofCounters from "@/components/home/ProofCounters";
import ProjectsSection from "@/components/home/ProjectsSection";
import StorySection from "@/components/home/StorySection";
import StrengthsSection from "@/components/home/StrengthsSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ProofCounters />
        <ProjectsSection />
        <StrengthsSection />
        <StorySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
