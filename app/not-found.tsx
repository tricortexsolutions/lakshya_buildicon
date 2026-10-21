import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5F0] px-4 text-[#242424]">
      <div className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#B99A62]">404</p>
        <h1 className="text-4xl font-semibold tracking-[-0.06em] md:text-5xl">Page not found</h1>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-[#242424] px-6 py-3 text-sm font-medium text-[#F7F5F0]">
          Return home
        </Link>
      </div>
    </main>
  );
}
