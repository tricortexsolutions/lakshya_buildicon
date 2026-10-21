import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[900px] px-4 py-28 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#B99A62]">Privacy Policy</p>
        <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#242424] md:text-5xl">Draft policy for review</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-[#242424]/75">
          <p>Draft, to be reviewed by legal counsel. This page is a placeholder and will be replaced with the final privacy policy before public launch.</p>
          <p>We collect information you provide when submitting an enquiry, including your name, phone number, and other contact details, to respond to your requirements.</p>
          <p>We use this information only to communicate with you about your property enquiry, improve our service experience, and manage our business interactions.</p>
          <p>By using this website, you consent to the storage and handling of your information in line with applicable Indian privacy obligations.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
