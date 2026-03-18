"use client";

import { Github, Linkedin } from "lucide-react";
import { profile } from "@/data/profile";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <p className="text-xl font-bold tracking-tighter text-foreground">
            {profile.businessName}
          </p>
          <p className="text-sm font-medium text-muted-foreground">
            © {currentYear} {profile.businessName}. All rights reserved.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <a
            href={profile.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-white hover:border-primary"
            aria-label="GitHub"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={profile.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all hover:bg-primary hover:text-white hover:border-primary"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
