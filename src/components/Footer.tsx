import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-[3px] border-ink bg-cream">
      <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs uppercase tracking-wide text-ink/60">
        <span>&copy; {year} Holly Johanna. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="transition-colors duration-300 hover:text-rose"
          >
            Contact
          </Link>
          <a
            href="mailto:hollyjohanna.robbins@gmail.com"
            className="transition-colors duration-300 hover:text-rose"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
