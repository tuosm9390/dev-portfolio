"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { profile } from "@/data/profile";

const navLinks = [
  { label: "소개", href: "#about" },
  { label: "프로젝트", href: "#projects" },
  { label: "연락하기", href: "#contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="nav-glass fixed top-0 left-0 right-0 z-50 h-[48px] flex items-center">
      <div className="mx-auto flex w-full max-w-[1024px] items-center justify-between px-6">
        {/* Logo - Apple Style Centered or Left */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-[17px] font-semibold tracking-tight text-white/90 transition-opacity hover:opacity-100"
        >
          {profile.businessName}
        </a>

        {/* Desktop Nav - Centered Links */}
        <nav className="hidden items-center gap-8 md:flex absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-[12px] font-normal text-white/80 transition-opacity hover:opacity-100"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Icons - Right Side */}
        <div className="hidden items-center gap-6 md:flex">
          <button className="text-white/80 transition-opacity hover:opacity-100">
            <Search size={16} />
          </button>
          <button className="text-white/80 transition-opacity hover:opacity-100">
            <ShoppingBag size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white md:hidden"
          aria-label="메뉴 토글"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-[48px] z-40 bg-black md:hidden"
          >
            <nav className="flex flex-col gap-0 px-10 pt-10">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="border-b border-white/10 py-4 text-left text-2xl font-semibold text-white/90 transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => handleNavClick("#contact")}
                className="mt-6 text-left text-2xl font-semibold text-apple-blue"
              >
                프로젝트 의뢰
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
