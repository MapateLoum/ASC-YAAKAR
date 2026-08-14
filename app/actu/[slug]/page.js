import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/data";
import ImageCarousel from "@/components/ImageCarousel";

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

      {article.images && article.images.length > 0 && (
        <ImageCarousel images={article.images} alt={article.titre} />
      )}

      {article.videos && article.videos.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {article.videos.map((url) => (
            <video
              key={url}
              src={url}
              controls
              className="w-full rounded-xl border border-charcoal-line"
            />
          ))}
        </div>
      )}

      <div className="mt-8 space-y-4 whitespace-pre-line leading-relaxed text-bone-dim">
        {article.contenu}
      </div>
    </div>
  );
}