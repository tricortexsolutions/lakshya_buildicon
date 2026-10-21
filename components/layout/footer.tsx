import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/content/site";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#242424]/10 bg-[#F7F5F0] text-[#1a1a1a]">
      <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">

          {/* Brand */}
          <div>
            <div className="mb-5">
              <Image
                src="/images/logo.png"
                alt="Lakshya Buildcon"
                width={260}
                height={115}
                className="h-24 w-auto object-contain"
                unoptimized
              />
            </div>
            <p className="max-w-xs text-sm leading-7 text-[#1a1a1a]/60">
              Designing purposeful spaces and thoughtful communities, shaped for everyday living
              and long-term value.
            </p>

            {/* Social / contact pills */}
            <div className="mt-6 flex flex-wrap gap-2">
              {siteConfig.company.phone ? (
                <a
                  href={`tel:${siteConfig.company.phone}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#242424]/12 bg-white px-3 py-1.5 text-xs text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a]"
                >
                  <Phone size={11} />
                  {siteConfig.company.phone}
                </a>
              ) : null}
              {siteConfig.company.email ? (
                <a
                  href={`mailto:${siteConfig.company.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#242424]/12 bg-white px-3 py-1.5 text-xs text-[#1a1a1a]/70 transition-colors hover:text-[#1a1a1a]"
                >
                  <Mail size={11} />
                  {siteConfig.company.email}
                </a>
              ) : null}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#B99A62]">
              Navigate
            </h3>
            <ul className="space-y-3 text-sm text-[#1a1a1a]/60">
              {siteConfig.nav.slice(0, 6).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="transition-colors hover:text-[#1a1a1a]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#B99A62]">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-[#1a1a1a]/60">
              <li>
                <Link href="/privacy" className="transition-colors hover:text-[#1a1a1a]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition-colors hover:text-[#1a1a1a]">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="mb-5 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-[#B99A62]">
              Visit Us
            </h3>
            <div className="flex items-start gap-2 text-sm leading-6 text-[#1a1a1a]/60">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#B99A62]" />
              <div>
                {siteConfig.company.address || "Indore, Madhya Pradesh"}
                <br />
                {siteConfig.company.city}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#242424]/8 py-5 text-center text-[0.72rem] text-[#777777]">
        © {new Date().getFullYear()} {siteConfig.company.legal_name}. All rights reserved.
        {" "}Crafted with precision in Indore.
      </div>
    </footer>
  );
}
