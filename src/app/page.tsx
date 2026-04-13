import { Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ProjectsSection, { ProjectsSectionSkeleton } from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="page-top" className="main-copy-flow relative overflow-hidden">
        <HeroSection />
        <Suspense fallback={<ProjectsSectionSkeleton />}>
          <ProjectsSection />
        </Suspense>
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
