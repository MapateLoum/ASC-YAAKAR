import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/matchs", label: "Matchs" },
  { href: "/effectif", label: "Effectif" },
  { href: "/actu", label: "Actu quartier" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-charcoal-line bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/img/logo.jpeg"
            alt="Blason ASC Yaakar"
            width={44}
            height={44}
            className="rounded-md"
            priority
          />
          <span className="font-display text-xl tracking-wide text-bone">
            ASC <span className="text-gold">YAAKAR</span>
          </span>
        </Link>
        <nav className="hidden gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-bone-dim transition hover:text-gold-bright"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <details className="relative md:hidden">
      <summary className="list-none cursor-pointer rounded border border-charcoal-line px-3 py-1.5 text-sm text-bone">
        Menu
      </summary>
      <div className="absolute right-0 mt-2 w-44 rounded-lg border border-charcoal-line bg-ink-soft p-2 shadow-xl">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="block rounded px-3 py-2 text-sm text-bone hover:bg-charcoal hover:text-gold-bright"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
