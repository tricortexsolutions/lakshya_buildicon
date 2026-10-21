"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["home", "about", "projects", "gallery", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.3, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6 lg:px-8">
        <div
          className={`rounded-full px-4 py-2.5 transition-all duration-300 md:px-6 ${
            scrolled
              ? "border border-white/12 bg-[#111]/85 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl"
              : "border border-white/10 bg-[#111]/60 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Lakshya Buildcon Logo"
                width={150}
                height={65}
                className="h-14 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-7 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-white/70 md:flex">
              {siteConfig.nav.map((item) => {
                const isActive =
                  activeSection === item.href.replace("/#", "") ||
                  (item.href === "/#top" && activeSection === "home");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-[#D4B87A]" : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <a
                href="#contact"
                className="hidden rounded-full bg-[#B99A62] px-5 py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#c9aa72] sm:inline-flex"
              >
                Enquire Now
              </a>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white md:hidden"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {menuOpen ? (
            <nav className="mt-3 flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#1a1a1a] p-3 text-sm text-white md:hidden">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-white/75 transition hover:bg-white/6 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl bg-[#B99A62] px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Enquire Now
              </a>
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
}
