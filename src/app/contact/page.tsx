"use client";

import { motion } from "framer-motion";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import { profile } from "@/data/profile";

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="relative w-full min-h-screen bg-white text-black font-mono pt-40 px-6 md:px-20 selection:bg-black selection:text-white">
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[1200px] mx-auto pb-40"
        >
          {/* Section Breadcrumb */}
          <h1 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40">
            Contact
          </h1>

          {/* Heading */}
          <h2 className="text-2xl md:text-[36px] leading-[1.25] font-medium tracking-tight mb-20">
            Let&apos;s build something meaningful together.
          </h2>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 pt-12 border-t border-black/5 text-[11px] leading-[1.6]">
            {/* Column 1: Core Channels */}
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Email</p>
                <a
                  href={`mailto:${profile.contact.email}`}
                  className="text-base font-medium hover:opacity-60 transition-opacity tracking-tight"
                >
                  {profile.contact.email}
                </a>
              </div>
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Phone</p>
                <p className="text-base font-medium tracking-tight">{profile.contact.phone}</p>
              </div>
            </div>

            {/* Column 2: Social Links */}
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Socials</p>
                <div className="flex flex-col gap-2 text-xs">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={profile.contact.linkedin}
                    className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                  >
                    LinkedIn
                  </a>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={profile.contact.github}
                    className="hover:underline opacity-80 hover:opacity-100 transition-opacity"
                  >
                    GitHub
                  </a>
                </div>
              </div>
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Location</p>
                <p className="font-medium text-black">Seoul, South Korea</p>
              </div>
            </div>

            {/* Column 3: Work specs */}
            <div className="space-y-6">
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Availability</p>
                <p className="opacity-80">
                  I am currently open to new opportunities, collaborations, and conversations. My typical response time is within 24 hours.
                </p>
              </div>
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Working Hours</p>
                <p className="font-medium">09:00 — 18:00 (KST)</p>
              </div>
              <div>
                <p className="uppercase tracking-widest opacity-40 mb-1">Current Status</p>
                <p className="font-medium text-green-600 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5"></span>
                  Available for projects
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <Footer />
      </main>
    </>
  );
}
