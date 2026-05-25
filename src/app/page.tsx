"use client";

import Page3DRoller from "@/components/home/Page3DRoller";
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
      <main className="h-screen w-screen overflow-hidden">
        <Page3DRoller>
          {/* Section 1: Hero & Proof Counters (통합 1단계) */}
          <div id="top" className="scroll-container overflow-y-auto h-full w-full bg-[#ffffff] flex flex-col justify-center items-center">
            <div className="w-full max-w-[1120px] py-16">
              <HeroSection />
              <ProofCounters />
            </div>
          </div>

          {/* Section 2: Projects (내부 스크롤 가능) */}
          <div id="projects" className="h-full w-full">
            <ProjectsSection />
          </div>

          {/* Section 3: Strengths */}
          <div id="strengths" className="scroll-container overflow-y-auto h-full w-full bg-[#f5f5f7] flex flex-col justify-center items-center">
            <div className="w-full">
              <StrengthsSection />
            </div>
          </div>

          {/* Section 4: Story */}
          <div id="about" className="scroll-container overflow-y-auto h-full w-full bg-[#ffffff] flex flex-col justify-center items-center">
            <div className="w-full">
              <StorySection />
            </div>
          </div>

          {/* Section 5: Contact & Footer 병합 (내부 스크롤 가능) */}
          <div id="contact" className="scroll-container overflow-y-auto h-full w-full bg-[#000000] flex flex-col justify-between pt-12 md:pt-16">
            <div className="flex-grow flex flex-col justify-center items-center w-full">
              <ContactSection />
            </div>
            <Footer />
          </div>
        </Page3DRoller>
      </main>
    </>
  );
}
