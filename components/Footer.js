import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-charcoal-line bg-ink-soft">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-display text-lg text-gold">ASC YAAKAR</p>
            <p className="mt-2 max-w-xs text-sm text-bone-dim">
              Association Sportive et Culturelle du quartier de Mboro, Thiès. Fierté du quartier, saison après saison.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-bright">
            Navigation
          </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/matchs" className="text-bone hover:text-gold-bright">Calendrier &amp; résultats</Link></li>
              <li><Link href="/effectif" className="text-bone hover:text-gold-bright">L&apos;effectif</Link></li>
              <li><Link href="/actu" className="text-bone hover:text-gold-bright">Actu du quartier</Link></li>
              {/* <li><Link href="/admin/login" className="text-bone-dim/70 hover:text-gold-bright">Espace admin</Link></li> */}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-bone-dim">
              Le quartier
            </p>
            <p className="mt-3 text-sm text-bone-dim">Mboro, Thiès — Sénégal</p>
          </div>
        </div>
        <p className="mt-10 text-xs text-bone-dim/60">
          © {new Date().getFullYear()} ASC Yaakar. Site du quartier. <br />Réalisé par Papa Mapaté Loum
        </p>
      </div>
    </footer>
  );
}
