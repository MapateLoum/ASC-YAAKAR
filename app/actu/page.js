import Link from "next/link";
import { getAllNews } from "@/lib/data";

export const metadata = { title: "Actu du quartier — ASC Yaakar" };

export default async function ActuPage() {
  let news = [];
  try {
    news = await getAllNews();
  } catch {
    news = [];
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
        Le quartier
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-wide text-bone">
        Actu du quartier
      </h1>

      {news.length === 0 ? (
        <p className="mt-8 rounded-xl border border-charcoal-line bg-charcoal p-6 text-bone-dim">
          Aucun article pour l&apos;instant.
        </p>
      ) : (
        <div className="mt-10 space-y-4">
{news.map((n) => (
  <Link
    key={n._id}
    href={`/actu/${n.slug}`}
    className="group flex gap-4 rounded-xl border border-charcoal-line bg-charcoal p-6 transition hover:border-gold"
  >
    {n.images && n.images.length > 0 && (
      <img
        src={n.images[0]}
        alt=""
        className="h-20 w-20 shrink-0 rounded-lg object-cover"
      />
    )}
    <div>
      <p className="font-score text-[11px] uppercase tracking-widest text-gold-bright">
        {new Date(n.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h2 className="mt-2 font-display text-2xl leading-tight text-bone group-hover:text-gold-bright">
        {n.titre}
      </h2>
      {n.resume && (
        <p className="mt-2 text-sm text-bone-dim">{n.resume}</p>
      )}
    </div>
  </Link>
))}
        </div>
      )}
    </div>
  );
}
