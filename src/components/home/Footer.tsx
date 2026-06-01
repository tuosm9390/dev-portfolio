"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="w-full px-6 md:px-20 pb-40">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full border-t border-black/5 pt-24"
      >
        <h2 className="text-[11px] tracking-[0.2em] uppercase mb-16 opacity-40 font-mono">
          Let&apos;s Connect
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 items-start font-mono">
          {/* Column 1: Contact */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Contact</p>
            <a
              href={`mailto:${profile.contact.email}`}
              className="text-[16px] md:text-[18px] font-medium hover:opacity-60 transition-opacity tracking-tight"
            >
              {profile.contact.email}
            </a>
          </div>

          {/* Column 2: Socials */}
          <div className="flex flex-col gap-4 md:items-center">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Socials</p>
            <div className="flex flex-col gap-2 md:items-center">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={profile.contact.linkedin}
                className="text-[12px] opacity-80 hover:opacity-100 transition-opacity"
              >
                LinkedIn
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={profile.contact.github}
                className="text-[12px] opacity-80 hover:opacity-100 transition-opacity"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Column 3: Availability */}
          <div className="flex flex-col gap-4 md:items-end">
            <p className="text-[10px] uppercase tracking-widest opacity-40">Availability</p>
            <div className="text-left md:text-right">
              <p className="text-[12px] opacity-80">Currently based in Seoul, KR</p>
              <p className="text-[12px] opacity-80 mt-1">Open for new opportunities.</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-40 flex justify-between items-center text-[10px] opacity-30 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} {profile.businessName}</p>
        </div>
      </motion.div>
    </footer>
  );
}
