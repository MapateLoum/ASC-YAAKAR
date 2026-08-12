import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/data";

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  let article = null;
  try {
    article = await getNewsBySlug(slug);
  } catch {
    article = null;
  }

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <Link
        href="/actu"
        className="text-sm font-medium text-gold-bright hover:underline"
      >
        ← Toute l&apos;actu
      </Link>

      <p className="mt-6 font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
        {new Date(article.date).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-2 font-display text-4xl leading-tight tracking-wide text-bone">
        {article.titre}
      </h1>

      {article.image && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-xl border border-charcoal-line">
          <Image
            src={article.image}
            alt={article.titre}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="mt-8 space-y-4 whitespace-pre-line leading-relaxed text-bone-dim">
        {article.contenu}
      </div>
    </div>
  );
}
