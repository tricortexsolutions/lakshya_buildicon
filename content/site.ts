export type NavItem = {
  label: string;
  href: string;
};

export type SocialLinks = {
  instagram: string;
  facebook: string;
  linkedin: string;
  youtube: string;
};

export type CompanyConfig = {
  legal_name: string;
  tagline: string;
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  maps_url: string;
  social: SocialLinks;
  about_facts: string[];
};

export type FormDeliveryConfig = {
  provider: string;
  public_key_or_endpoint: string;
};

export const siteConfig = {
  company: {
    legal_name: "Lakshya Buildcon",
    tagline: "WE SHAPE YOUR DREAM",
    city: "Indore, Madhya Pradesh, India",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    maps_url: "",
    social: {
      instagram: "",
      facebook: "",
      linkedin: "",
      youtube: "",
    },
    about_facts: [],
  },
  projects: [],
  form_delivery: {
    provider: "",
    public_key_or_endpoint: "",
  },
  nav: [
    { label: "Home", href: "/#top" },
    { label: "About Us", href: "/#about" },
    { label: "Projects", href: "/#projects" },
    { label: "Residential", href: "/#residential" },
    { label: "Commercial", href: "/#commercial" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/#contact" },
    { label: "Enquire Now", href: "/#contact" },
  ] as NavItem[],
} as const;

export const missingOwnerInputs = [
  "Office address",
  "Phone number",
  "WhatsApp number",
  "Email address",
  "Maps URL",
  "Social links",
  "Project portfolio",
  "Form backend key or endpoint",
  "Brand logo variant",
].filter((item) => item);

export const trustPoints = [
  "Thoughtful planning",
  "Transparent communication",
  "Location-focused development",
  "Quality-conscious execution",
  "Customer support",
];

export const galleryTabs = [
  "Exterior",
  "Interior",
  "Construction progress",
  "Aerial",
  "Videos",
] as const;
