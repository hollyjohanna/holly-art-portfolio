import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-cream">
      <div className="px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 label text-ink/40">
        <span>&copy; {year} Holly Johanna. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link
            href="/contact"
            className="transition-colors duration-300 hover:text-ink/70"
          >
            Contact
          </Link>
          <a
            href="mailto:hollyjohanna.robbins@gmail.com"
            className="transition-colors duration-300 hover:text-ink/70"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
