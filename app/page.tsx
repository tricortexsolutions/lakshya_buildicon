import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, ShieldCheck, Sparkles, Users, Phone, Mail } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { HeroSection } from "@/components/sections/hero";
import { allProjects } from "@/content/projects";
import { siteConfig, trustPoints } from "@/content/site";

const galleryItems = [
  {
    title: "Grand Exterior",
    caption: "Architectural Excellence",
    image: "/images/luxury-exterior.jpg",
  },
  {
    title: "Premium Interior",
    caption: "Refined Living Spaces",
    image: "/images/luxury-interior.jpg",
  },
  {
    title: "Resort Amenities",
    caption: "Five-Star Lifestyle",
    image: "/images/luxury-amenities.jpg",
  },
  {
    title: "Grand Lobby",
    caption: "Hotel-Like Arrival",
    image: "/images/luxury-lobby.jpg",
  },
];

const amenityImages = [
  "/images/luxury-amenities.jpg",
  "/images/luxury-interior.jpg",
  "/images/luxury-exterior.jpg",
  "/images/luxury-lobby.jpg",
];

export default function HomePage() {
  const projects = allProjects;

  return (
    <>
      <Header />
      <main id="top" className="bg-[#F7F5F0] text-[#1a1a1a]">
        <HeroSection />

        {/* ═══════════ KEY STATS HIGHLIGHTS STRIP ═══════════ */}
        <section className="relative z-10 border-b border-white/10 bg-[#0d0d0d] text-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-y divide-white/10 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {[
                { stat: "10+", label: "Years of Trust" },
                { stat: "50+", label: "Completed Projects" },
                { stat: "1,200+", label: "Happy Families" },
                { stat: "100%", label: "RERA Compliant" },
              ].map(({ stat, label }) => (
                <div key={label} className="flex flex-col items-center justify-center p-4 text-center sm:p-6 lg:p-8">
                  <div className="font-serif text-3xl font-semibold tracking-tight text-[#D4B87A] sm:text-4xl lg:text-5xl">
                    {stat}
                  </div>
                  <div className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-white/50 sm:text-[0.72rem]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ MARQUEE STRIP ═══════════ */}
        <div className="overflow-hidden border-y border-[#242424]/8 bg-[#1a1a1a] py-4 text-white">
          <div className="animate-marquee flex gap-0 whitespace-nowrap">
            {[
              "Premium Construction",
              "RERA Compliant",
              "10+ Years",
              "Indore's Finest",
              "50+ Projects",
              "Trusted Builder",
              "Premium Construction",
              "RERA Compliant",
              "10+ Years",
              "Indore's Finest",
              "50+ Projects",
              "Trusted Builder",
            ].map((text, i) => (
              <span key={i} className="flex items-center gap-6 px-6 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-white/70">
                {text}
                <span className="h-1 w-1 rounded-full bg-[#B99A62]" />
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════ ABOUT ═══════════ */}
        <section id="about" className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                <span className="h-px w-8 bg-[#B99A62]" />
                About Lakshya Buildcon
              </div>
              <h2 className="max-w-xl text-4xl font-light leading-[1.15] tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl lg:text-6xl">
                Building More Than Spaces.
                <em className="not-italic text-[#B99A62]"> Building Futures.</em>
              </h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#1a1a1a]/65">
                Lakshya Buildcon shapes residential and commercial properties with thoughtful
                planning, considered design, and a clear focus on long-term value. The aim is
                simple: create places that feel intentional, practical, and enduring.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { title: "Prime Corridors", desc: "Super Corridor & AB Bypass" },
                  { title: "Vastu Harmony", desc: "Thoughtful spatial layout" },
                  { title: "Turnkey Finish", desc: "Teak, marble & luxury fitouts" },
                  { title: "Clear Titles", desc: "100% Bank Approved" },
                ].map(({ title, desc }) => (
                  <div key={title} className="rounded-2xl border border-[#242424]/8 bg-white p-4 text-center shadow-sm">
                    <div className="text-sm font-semibold text-[#B99A62]">{title}</div>
                    <div className="mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-[#1a1a1a]/55">{desc}</div>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#projects"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#1a1a1a] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#2d2d2d]"
                >
                  Explore Projects <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#242424]/20 bg-white px-7 py-3.5 text-sm font-medium text-[#1a1a1a] transition-all duration-300 hover:border-[#242424]/40"
                >
                  View Gallery
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.12)]">
                <Image
                  src="/images/luxury-exterior.jpg"
                  alt="Lakshya Buildcon premium development exterior"
                  width={900}
                  height={1100}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#B99A62]/30 bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
                <div className="text-3xl font-semibold text-[#B99A62]">10+</div>
                <div className="mt-1 text-[0.62rem] uppercase tracking-[0.18em] text-[#1a1a1a]/60">Years of Legacy</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ PROJECTS ═══════════ */}
        <section id="projects" className="py-24 lg:py-32" style={{ backgroundColor: "#F0EBE1" }}>
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                  <span className="h-px w-8 bg-[#B99A62]" />
                  Our Developments
                </div>
                <h2 className="text-4xl font-light tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl">
                  Curated <em className="not-italic font-semibold">Developments</em>
                </h2>
              </div>
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#1a1a1a]"
              >
                View all <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div id="residential" className="grid gap-8 lg:grid-cols-3">
              {projects.map((project) => (
                <article
                  key={project.slug}
                  className="group overflow-hidden rounded-[28px] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
                >
                  <div className="relative overflow-hidden" style={{ height: "260px" }}>
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      width={900}
                      height={700}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-107"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                      {project.status}
                    </span>
                  </div>
                  <div className="space-y-4 p-6">
                    <div>
                      <div className="mb-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.24em] text-[#B99A62]">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#1a1a1a]">
                        {project.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-[#1a1a1a]/60">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.specs.slice(0, 3).map((spec, index) => (
                        <span
                          key={`${project.slug}-${spec}-${index}`}
                          className="rounded-full border border-[#242424]/10 bg-[#F7F5F0] px-2.5 py-1 text-[0.58rem] uppercase tracking-[0.12em] text-[#1a1a1a]/60"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-t border-[#242424]/8 pt-4">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group/link inline-flex items-center gap-2 text-sm font-medium text-[#1a1a1a]"
                      >
                        Explore <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                      <a
                        href="#contact"
                        className="rounded-full bg-[#B99A62] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#c9aa72]"
                      >
                        Enquire
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ CRAFT & PROCESS ═══════════ */}
        <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="mb-14 text-center">
            <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
              <span className="h-px w-8 bg-[#B99A62]" />
              Our Process
              <span className="h-px w-8 bg-[#B99A62]" />
            </div>
            <h2 className="text-4xl font-light tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl">
              Designed With Purpose.{" "}
              <em className="not-italic font-semibold">Built With Precision.</em>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Planning",
                text: "Detailed evaluation of location, lifestyle, and long-term value before any major decision is made.",
              },
              {
                num: "02",
                title: "Transparency",
                text: "Clear communication and approachable guidance throughout the purchase or construction journey.",
              },
              {
                num: "03",
                title: "Execution",
                text: "Careful project coordination, practical decision-making, and attention to finishing details.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[28px] border border-[#242424]/8 bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-6 text-5xl font-light text-[#B99A62]/20 transition-all duration-300 group-hover:text-[#B99A62]/40">
                  {item.num}
                </div>
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F3EFE8] text-[#B99A62]">
                  <Building2 size={18} />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.04em] text-[#1a1a1a]">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-[#1a1a1a]/60">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ WHY LAKSHYA — DARK ═══════════ */}
        <section className="relative overflow-hidden bg-[#111] py-24 text-white lg:py-32">
          {/* Background texture */}
          <div className="pointer-events-none absolute inset-0 opacity-5"
            style={{ backgroundImage: "url('/images/hero-aerial.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#111] via-[#111]/90 to-[#111]" />

          <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 text-center">
              <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                <span className="h-px w-8 bg-[#B99A62]" />
                Why Choose Us
                <span className="h-px w-8 bg-[#B99A62]" />
              </div>
              <h2 className="text-4xl font-light tracking-[-0.04em] text-white sm:text-5xl">
                Built Around <em className="not-italic font-semibold text-[#D4B87A]">Trust and Clarity</em>
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {trustPoints.map((item, index) => {
                const icons = [Sparkles, ShieldCheck, MapPin, Users, Building2];
                const Icon = icons[index] ?? Sparkles;
                return (
                  <div
                    key={item}
                    className="group rounded-[24px] border border-white/8 bg-white/4 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-[#B99A62]/40 hover:bg-white/8"
                  >
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B99A62]/15 text-[#D4B87A] transition-all duration-300 group-hover:bg-[#B99A62]/25">
                      <Icon size={18} />
                    </div>
                    <p className="text-sm font-medium leading-6 text-white/85">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ AMENITIES SCROLL ═══════════ */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex items-end justify-between gap-4">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                  <span className="h-px w-8 bg-[#B99A62]" />
                  Lifestyle
                </div>
                <h2 className="text-4xl font-light tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl">
                  Amenities &amp;{" "}
                  <em className="not-italic font-semibold">Everyday Comfort</em>
                </h2>
              </div>
              <Link
                href="/projects"
                className="group hidden items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#1a1a1a] md:inline-flex"
              >
                Explore more <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Full-width horizontal scroll strip */}
          <div className="relative">
            <div className="-mx-0 flex snap-x gap-5 overflow-x-auto pb-4 pl-4 pr-4 scrollbar-hide sm:pl-6 lg:pl-[max(1.5rem,calc((100vw-1400px)/2+1.5rem))]">
              {projects[0].amenities.map((amenity, index) => (
                <div
                  key={`${amenity}-${index}`}
                  className="group min-w-[280px] flex-shrink-0 snap-start overflow-hidden rounded-[24px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] sm:min-w-[320px]"
                >
                  <div className="relative overflow-hidden" style={{ height: "220px" }}>
                    <Image
                      src={amenityImages[index % amenityImages.length]}
                      alt={amenity}
                      width={600}
                      height={420}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="mb-1.5 text-[0.55rem] uppercase tracking-[0.22em] text-[#B99A62]">Amenity</div>
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#1a1a1a]">{amenity}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ GALLERY GRID ═══════════ */}
        <section id="gallery" className="py-24 lg:py-32" style={{ backgroundColor: "#F0EBE1" }}>
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-14 flex items-end justify-between gap-5">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                  <span className="h-px w-8 bg-[#B99A62]" />
                  Visual Journey
                </div>
                <h2 className="text-4xl font-light tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl">
                  Project <em className="not-italic font-semibold">Glimpses</em>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#1a1a1a]"
              >
                Open gallery <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Masonry-like grid */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {galleryItems.map((item, idx) => (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-[24px] bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.14)] ${idx === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
                >
                  <div className={`relative overflow-hidden ${idx === 0 ? "h-[480px]" : "h-[220px]"}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={900}
                      height={700}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-1 text-[0.58rem] uppercase tracking-[0.22em] text-white/60">{item.caption}</div>
                      <span className="text-base font-semibold text-white">{item.title}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ LOCATION ═══════════ */}
        <section className="mx-auto max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                <span className="h-px w-8 bg-[#B99A62]" />
                Location
              </div>
              <h2 className="text-4xl font-light leading-[1.15] tracking-[-0.04em] text-[#1a1a1a] sm:text-5xl">
                Connected to the Places{" "}
                <em className="not-italic font-semibold">You Value.</em>
              </h2>
              <div className="mt-6 space-y-3 text-sm leading-7 text-[#1a1a1a]/60">
                {siteConfig.company.address ? (
                  <p>{siteConfig.company.address}</p>
                ) : (
                  <p>Indore, Madhya Pradesh, India</p>
                )}
                <p>{siteConfig.company.city}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {siteConfig.company.maps_url ? (
                  <a
                    href={siteConfig.company.maps_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#242424]/20 bg-white px-5 py-3 text-sm font-medium text-[#1a1a1a] shadow-sm transition-all duration-300 hover:border-[#242424]/40"
                  >
                    <MapPin size={14} />
                    Get Directions
                  </a>
                ) : null}
                {siteConfig.company.phone ? (
                  <a
                    href={`tel:${siteConfig.company.phone}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#B99A62] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#c9aa72]"
                  >
                    <Phone size={14} />
                    Call Us
                  </a>
                ) : null}
              </div>
            </div>
            <div className="rounded-[32px] border border-[#242424]/8 bg-white p-3 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="h-[420px] overflow-hidden rounded-[26px]">
                <Image
                  src="/images/hero-aerial.jpg"
                  alt="Indore city construction development area"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ CONTACT ═══════════ */}
        <section id="contact" className="relative overflow-hidden bg-[#111] py-24 text-white lg:py-32">
          <div className="pointer-events-none absolute inset-0 opacity-10"
            style={{ backgroundImage: "url('/images/luxury-interior.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/90 to-[#111]/70" />

          <div className="relative mx-auto grid max-w-[1400px] gap-14 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div className="flex flex-col justify-center">
              <div className="mb-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#B99A62]">
                <span className="h-px w-8 bg-[#B99A62]" />
                Contact
              </div>
              <h2 className="text-4xl font-light leading-[1.15] tracking-[-0.04em] text-white sm:text-5xl">
                {"Let's Find the Right Property"}
                <em className="not-italic font-semibold text-[#D4B87A]"> For You.</em>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">
                Reach out and we will guide you through your options — no pressure, just clarity.
              </p>
              <div className="mt-8 space-y-4 text-sm">
                {siteConfig.company.phone ? (
                  <a href={`tel:${siteConfig.company.phone}`} className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
                    <Phone size={14} className="text-[#B99A62]" />
                    {siteConfig.company.phone}
                  </a>
                ) : null}
                {siteConfig.company.email ? (
                  <a href={`mailto:${siteConfig.company.email}`} className="flex items-center gap-3 text-white/70 transition-colors hover:text-white">
                    <Mail size={14} className="text-[#B99A62]" />
                    {siteConfig.company.email}
                  </a>
                ) : null}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/95 p-7 text-[#1a1a1a] shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
              <div className="mb-6">
                <h3 className="text-xl font-semibold tracking-[-0.03em]">Request a Callback</h3>
                <p className="mt-1 text-sm text-[#1a1a1a]/55">We&apos;ll respond within 24 hours.</p>
              </div>
              <EnquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
