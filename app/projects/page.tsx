import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { allProjects } from "@/content/projects";

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#B99A62]">Projects</p>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#242424] md:text-6xl">Residential and commercial opportunities</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {allProjects.map((project) => (
            <article key={project.slug} className="overflow-hidden rounded-[28px] border border-[#242424]/10 bg-white shadow-[0_20px_40px_rgba(36,36,36,0.04)]">
              <Image src={project.images[0]} alt={project.name} width={900} height={700} className="h-64 w-full object-cover" unoptimized />
              <div className="space-y-4 p-6">
                <div className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#B99A62]">{project.category}</div>
                <h2 className="text-2xl font-semibold tracking-[-0.06em] text-[#242424]">{project.name}</h2>
                <p className="text-sm leading-7 text-[#242424]/70">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.specs.map((spec, index) => (
                    <span key={`${project.slug}-${spec}-${index}`} className="rounded-full border border-[#242424]/10 bg-[#F7F5F0] px-2 py-1 text-[0.56rem] uppercase tracking-[0.15em] text-[#242424]/70">
                      {spec}
                    </span>
                  ))}
                </div>
                <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-[#242424]">
                  Explore project <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
