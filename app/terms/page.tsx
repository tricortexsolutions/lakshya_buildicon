import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[900px] px-4 py-28 sm:px-6 lg:px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#B99A62]">Terms</p>
        <h1 className="text-4xl font-semibold tracking-[-0.06em] text-[#242424] md:text-5xl">Draft terms for review</h1>
        <div className="mt-8 space-y-5 text-sm leading-7 text-[#242424]/75">
          <p>Draft, to be reviewed by legal counsel. These terms are a preliminary template and should be finalised before release.</p>
          <p>By accessing this website, you agree to use it for informational and enquiry purposes only. No financial or legal advice is given by this website.</p>
          <p>Information provided on this website is subject to change and may not form a contractual offer. Any project-specific detail should be confirmed directly with Lakshya Buildcon.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
