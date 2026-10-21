export type ProjectRecord = {
  slug: string;
  name: string;
  location: string;
  category: "Residential" | "Commercial";
  status: string;
  description: string;
  specs: string[];
  amenities: string[];
  images: string[];
  brochure_pdf?: string;
  rera_no?: string;
  accent: string;
};

export const demoProjects: ProjectRecord[] = [
  {
    slug: "sample-residence",
    name: "Sample Residence",
    location: "Indore",
    category: "Residential",
    status: "SAMPLE PROJECT",
    description: "A sample residential concept highlighting modern planning, open layouts, and a balanced lifestyle offering.",
    specs: ["To be confirmed", "To be confirmed", "To be confirmed"],
    amenities: ["To be confirmed", "To be confirmed", "To be confirmed"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
    ],
    brochure_pdf: "",
    rera_no: "",
    accent: "#B99A62",
  },
  {
    slug: "sample-villa",
    name: "Sample Villa",
    location: "Indore West",
    category: "Residential",
    status: "SAMPLE PROJECT",
    description: "A lifestyle-led sample villa concept focused on privacy, light, and contemporary architectural proportions.",
    specs: ["To be confirmed", "To be confirmed", "To be confirmed"],
    amenities: ["To be confirmed", "To be confirmed", "To be confirmed"],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80",
    ],
    brochure_pdf: "",
    rera_no: "",
    accent: "#8A7A60",
  },
  {
    slug: "sample-commercial",
    name: "Sample Commercial Hub",
    location: "Scheme 94",
    category: "Commercial",
    status: "SAMPLE PROJECT",
    description: "A sample mixed-use commercial concept designed to balance visibility, mobility, and everyday business convenience.",
    specs: ["To be confirmed", "To be confirmed", "To be confirmed"],
    amenities: ["To be confirmed", "To be confirmed", "To be confirmed"],
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    ],
    brochure_pdf: "",
    rera_no: "",
    accent: "#7B6B54",
  },
];

export const allProjects = demoProjects;
