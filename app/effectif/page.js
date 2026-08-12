import Image from "next/image";
import { getAllPlayers } from "@/lib/data";

export const metadata = { title: "Effectif — ASC Yaakar" };

export default async function EffectifPage() {
  let players = [];

  try {
    players = await getAllPlayers();
  } catch {
    players = [];
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
        L&apos;équipe
      </p>

      <h1 className="mt-2 font-display text-4xl tracking-wide text-bone">
        Effectif
      </h1>

      {players.length === 0 ? (
        <p className="mt-8 rounded-xl border border-charcoal-line bg-charcoal p-6 text-bone-dim">
          L&apos;effectif sera bientôt en ligne, reviens plus tard !
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {players.map((p) => {
            // On vérifie que photo est bien une URL texte valide
            const photo =
              typeof p.photo === "string" && p.photo.trim() !== ""
                ? p.photo.trim()
                : null;

            return (
              <div
                key={p._id}
                className="group overflow-hidden rounded-xl border border-charcoal-line bg-charcoal transition hover:border-gold"
              >
                <div className="relative aspect-square w-full bg-ink-soft">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={p.nom || "Joueur"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-display text-4xl text-charcoal-line">
                      {p.numero ?? "—"}
                    </div>
                  )}

                  {p.numero !== null && p.numero !== undefined && (
                    <span className="absolute right-2 top-2 rounded-md bg-ink/80 px-2 py-1 font-score text-xs font-bold text-gold-bright">
                      #{p.numero}
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <p className="font-display text-base leading-tight text-bone">
                    {p.nom}
                  </p>

                  <p className="text-xs uppercase tracking-wider text-gold-bright">
                    {p.poste}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}