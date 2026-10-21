import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const galleryItems = [
  { title: "Exterior", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80" },
  { title: "Interior", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80" },
  { title: "Construction progress", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80" },
  { title: "Aerial view", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80" },
  { title: "Lifestyle", image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80" },
  { title: "Project detail", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80" },
];

export default function GalleryPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1400px] px-4 py-28 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#B99A62]">Gallery</p>
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#242424] md:text-6xl">A closer look at the spaces we shape</h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {galleryItems.map((item) => (
            <div key={item.title} className="group overflow-hidden rounded-[24px] border border-[#242424]/10 bg-white shadow-[0_18px_30px_rgba(36,36,36,0.04)]">
              <Image src={item.image} alt={item.title} width={900} height={700} className="h-80 w-full object-cover transition duration-500 group-hover:scale-105" unoptimized />
              <div className="p-5">
                <div className="text-[0.56rem] uppercase tracking-[0.2em] text-[#B99A62]">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
