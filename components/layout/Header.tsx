import Link from "next/link";
import { Container } from "@/components/ui/Container";

const NAV_LINKS = [{ href: "/challenges", label: "Challenges" }];

export function Header() {
  return (
    <header className="border-b border-graphite-800">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-lg font-semibold tracking-tight">
          Retake
        </Link>

        <nav className="flex items-center gap-lg">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-graphite-200 transition-colors duration-fast hover:text-graphite-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
