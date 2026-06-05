"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PortfolioAssistantIsland from "@/components/assistant/PortfolioAssistantIsland";
import { profile } from "@/data/profile";

export default function Header() {
  const [seoulTime, setSeoulTime] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setSeoulTime(formatter.format(new Date()));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/posts", label: "POSTS" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header className="absolute top-0 left-0 w-full px-6 md:px-20 pt-10 flex justify-between items-start z-50 text-[11px] tracking-tight font-mono">
      {/* Brand & Availability Status */}
      <div className="flex flex-col items-start relative z-[60]">
        <Link href="/" className="font-bold hover:opacity-75 transition-opacity uppercase">
          {profile.businessName}
        </Link>
        <div className="flex items-center mt-1">
          <div className="rounded-full bg-green-500 h-1.5 w-1.5 animate-pulse"></div>
          <span className="ml-1.5 opacity-60 text-[9px] uppercase tracking-wider">AVAILABLE FOR WORK</span>
        </div>
      </div>

      {/* Desktop Navigation & Clock */}
      <div className="hidden md:flex gap-16 items-start" aria-hidden={isMenuOpen}>
        <nav className="flex gap-8">
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-opacity hover:opacity-50 ${
                  isActive ? "opacity-100 font-semibold border-b border-black pb-0.5" : "opacity-60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            className="transition-opacity hover:opacity-50 opacity-80 lowercase"
            data-assistant-trigger="desktop"
          >
            ask me!
          </button>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-opacity hover:opacity-50 ${
                  isActive ? "opacity-100 font-semibold border-b border-black pb-0.5" : "opacity-60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex flex-col items-end opacity-60">
          <span>SEOUL TIME</span>
          <span className="mt-1 tabular-nums font-medium">{seoulTime}</span>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden relative z-[60] p-2 -mr-2"
        aria-label="Toggle menu"
      >
        <div className="flex flex-col gap-1 items-end w-5">
          <div
            className={`h-[1px] bg-black transition-all duration-300 ${
              isMenuOpen ? "transform rotate-45 translate-y-1 w-5" : "w-5"
            }`}
          ></div>
          <div
            className={`h-[1px] bg-black transition-all duration-300 ${
              isMenuOpen ? "opacity-0 w-0" : "w-3"
            }`}
          ></div>
          <div
            className={`h-[1px] bg-black transition-all duration-300 ${
              isMenuOpen ? "transform -rotate-45 -translate-y-1 w-5" : "w-4"
            }`}
          ></div>
        </div>
      </button>

      {/* Mobile Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-[50] flex flex-col justify-center px-6" data-mobile-menu="open">
          <nav className="flex flex-col gap-6 text-base font-bold tracking-widest text-center">
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(false);
                setIsAssistantOpen(true);
              }}
              className="hover:opacity-50 py-2 border-b border-black/5 lowercase"
              data-assistant-trigger="mobile"
            >
              ask me!
            </button>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="hover:opacity-50 py-2 border-b border-black/5"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-10 left-0 w-full flex flex-col items-center opacity-60 text-[10px]">
            <span>SEOUL TIME</span>
            <span className="mt-1 tabular-nums font-semibold text-xs">{seoulTime}</span>
          </div>
        </div>
      )}
      <PortfolioAssistantIsland
        triggerLabel="ask me!"
        open={isAssistantOpen}
        onOpenChange={setIsAssistantOpen}
        renderTrigger={() => null}
      />
    </header>
  );
}
