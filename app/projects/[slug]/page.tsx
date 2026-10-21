import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { allProjects } from "@/content/projects";

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((item) => item.slug === params.slug) ?? allProjects[0];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-3">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-[#242424]">
            <ArrowLeft size={14} /> Back to projects
          </Link>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="overflow-hidden rounded-[30px] border border-[#242424]/10 bg-white shadow-[0_20px_40px_rgba(36,36,36,0.04)]">
              <Image src={project.images[0]} alt={project.name} width={1200} height={900} className="h-[520px] w-full object-cover" unoptimized />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {project.images.slice(0, 3).map((image, index) => (
                <div key={`${project.slug}-${image}-${index}`} className="overflow-hidden rounded-[22px] border border-[#242424]/10">
                  <Image src={image} alt={project.name} width={700} height={520} className="h-44 w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <div className="mb-3 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-[#B99A62]">{project.category}</div>
              <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#242424] md:text-5xl">{project.name}</h1>
            </div>

            <div className="rounded-[26px] border border-[#242424]/10 bg-[#F3EFE8] p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.56rem] uppercase tracking-[0.18em] text-[#242424]/65">Status</span>
                <span className="rounded-full border border-[#242424]/15 bg-white px-2 py-1 text-[0.56rem] uppercase tracking-[0.18em] text-[#242424]">{project.status}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#242424]/75">{project.description}</p>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.18em] text-[#242424]">Key specs</h2>
              <div className="flex flex-wrap gap-2">
                {project.specs.map((spec, index) => (
                  <span key={`${project.slug}-spec-${spec}-${index}`} className="rounded-full border border-[#242424]/10 bg-white px-3 py-2 text-[0.6rem] uppercase tracking-[0.12em] text-[#242424]/70">{spec}</span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold uppercase tracking-[0.18em] text-[#242424]">Amenities</h2>
              <ul className="space-y-2 text-sm text-[#242424]/75">
                {project.amenities.map((item, index) => (
                  <li key={`${project.slug}-amenity-${item}-${index}`}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#242424] px-6 py-3 text-sm font-medium text-[#F7F5F0]">
                Enquire Now <ArrowRight size={14} />
              </a>
              {project.brochure_pdf ? (
                <a href={project.brochure_pdf} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#242424]/15 bg-white px-6 py-3 text-sm font-medium text-[#242424]">
                  Download brochure
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
