import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";

const EMAIL_SUBJECT = "Hey I love your work! Let's chat";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-cream">
      <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-5 label text-ink/40">
        <span>&copy; {year} Holly Johanna. All rights reserved.</span>
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className="transition-colors duration-300 hover:text-ink/70"
            >
              Contact
            </Link>
            <a
              href={`mailto:hollyjohanna.robbins@gmail.com?subject=${encodeURIComponent(EMAIL_SUBJECT)}`}
              className="transition-colors duration-300 hover:text-ink/70"
            >
              Email
            </a>
          </div>
          <SocialLinks showLabels={false} />
        </div>
      </div>
    </footer>
  );
}
