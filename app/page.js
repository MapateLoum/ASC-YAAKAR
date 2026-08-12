import Link from "next/link";
import Image from "next/image";
import Scoreboard from "@/components/Scoreboard";
import { getNextMatch, getLastResult, getAllNews } from "@/lib/data";

export default async function Home() {
  let nextMatch = null;
  let lastResult = null;
  let news = [];

  try {
    [nextMatch, lastResult, news] = await Promise.all([
      getNextMatch(),
      getLastResult(),
      getAllNews(),
    ]);
  } catch {
    // Base de données pas encore configurée — la page reste utilisable.
  }

  return (
    <div>
      {/* HERO */}
      <section className="hex-field relative overflow-hidden border-b border-charcoal-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
              Navétanes — Mboro, Thiès
            </p>
            <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-wide text-bone md:text-7xl">
              ASC <span className="text-gold">YAAKAR</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-bone-dim">
              La fierté du quartier sur le terrain. Suis le calendrier, les
              résultats et l&apos;effectif de l&apos;équipe, saison après
              saison.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/matchs"
                className="rounded-md bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-bright"
              >
                Voir les matchs
              </Link>
              <Link
                href="/effectif"
                className="rounded-md border border-charcoal-line px-5 py-2.5 text-sm font-semibold text-bone transition hover:border-gold hover:text-gold-bright"
              >
                L&apos;effectif
              </Link>
            </div>
          </div>
          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-full bg-gold/10 blur-3xl" />
              <Image
                src="/img/logo.jpeg"
                alt="Blason ASC Yaakar"
                width={280}
                height={280}
                className="rounded-2xl border border-charcoal-line shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROCHAIN MATCH / DERNIER RESULTAT */}
      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-xl tracking-wide text-bone">
              Prochain match
            </h2>
            <Scoreboard match={nextMatch} />
          </div>
          <div>
            <h2 className="mb-3 font-display text-xl tracking-wide text-bone">
              Dernier résultat
            </h2>
            <Scoreboard match={lastResult} />
          </div>
        </div>
      </section>

      {/* A PROPOS */}
      <section className="border-y border-charcoal-line bg-ink-soft">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
          <div>
            <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
              Le club
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-wide text-bone">
              L&apos;ASC Yaakar
            </h2>
            <p className="mt-4 leading-relaxed text-bone-dim">
              L&apos;Association Sportive et Culturelle Yaakar représente le
              quartier de Mboro à chaque saison des Navétanes. Portée par les
              jeunes du quartier, l&apos;équipe se bat sur le terrain pour
              faire honneur à ses couleurs, noir et or.
            </p>
            <p className="mt-4 leading-relaxed text-bone-dim">
              &laquo; Yaakar &raquo; veut dire espoir en wolof — celui d&apos;un
              quartier qui se retrouve autour de son équipe, match après
              match.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 self-center">
            <StatCard label="Quartier" value="Mboro" />
            <StatCard label="Région" value="Thiès" />
            <StatCard label="Couleurs" value="Noir & Or" />
          </div>
        </div>
      </section>

      {/* DERNIERES ACTUS */}
      {news.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl tracking-wide text-bone">
              Actu du quartier
            </h2>
            <Link
              href="/actu"
              className="text-sm font-medium text-gold-bright hover:underline"
            >
              Tout voir →
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {news.slice(0, 3).map((n) => (
              <Link
                key={n._id}
                href={`/actu/${n.slug}`}
                className="group rounded-xl border border-charcoal-line bg-charcoal p-5 transition hover:border-gold"
              >
                <p className="font-score text-[11px] uppercase tracking-widest text-gold-bright">
                  {new Date(n.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <h3 className="mt-2 font-display text-lg leading-tight text-bone group-hover:text-gold-bright">
                  {n.titre}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-bone-dim">
                  {n.resume}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-charcoal-line bg-charcoal p-5 text-center">
      <p className="font-display text-xl text-gold-bright">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-bone-dim">
        {label}
      </p>
    </div>
  );
}
