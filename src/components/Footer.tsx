"use client";

import { Github, Linkedin } from "lucide-react";
import { profile } from "@/data/profile";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="section-light border-t border-black/5 px-6 py-24">
      <div className="mx-auto flex max-w-[1024px] flex-col items-center justify-between gap-12 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start text-center sm:text-left">
          <p className="text-[21px] font-semibold tracking-tight text-[#1d1d1f]">
            {profile.businessName}
          </p>
          <p className="text-[12px] font-medium text-black/40">
            © {currentYear} {profile.businessName}. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 transition-colors hover:text-apple-blue"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-black/40 transition-colors hover:text-apple-blue"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
