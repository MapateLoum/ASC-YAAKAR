import { getAllMatches } from "@/lib/data";

export const metadata = { title: "Matchs — ASC Yaakar" };

function statusLabel(status) {
  if (status === "termine") return "Terminé";
  if (status === "en_cours") return "En cours";
  return "À venir";
}

function statusColor(status) {
  if (status === "termine") return "text-bone-dim";
  if (status === "en_cours") return "text-pitch-bright";
  return "text-gold-bright";
}

export default async function MatchsPage() {
  let matches = [];
  try {
    matches = await getAllMatches();
  } catch {
    matches = [];
  }

  const upcoming = matches.filter((m) => m.status !== "termine");
  const played = matches
    .filter((m) => m.status === "termine")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="mx-auto max-w-4xl px-5 py-14">
      <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
        Navétanes
      </p>
      <h1 className="mt-2 font-display text-4xl tracking-wide text-bone">
        Calendrier &amp; résultats
      </h1>

      {matches.length === 0 && (
        <p className="mt-8 rounded-xl border border-charcoal-line bg-charcoal p-6 text-bone-dim">
          Aucun match enregistré pour l&apos;instant. Reviens bientôt !
        </p>
      )}

      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 font-display text-xl tracking-wide text-gold-bright">
            À venir
          </h2>
          <div className="space-y-3">
            {upcoming.map((m) => (
              <MatchRow key={m._id} match={m} />
            ))}
          </div>
        </section>
      )}

      {played.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-display text-xl tracking-wide text-bone">
            Résultats
          </h2>
          <div className="space-y-3">
            {played.map((m) => (
              <MatchRow key={m._id} match={m} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function MatchRow({ match }) {
  const home = match.domicile ? "ASC Yaakar" : match.adversaire;
  const away = match.domicile ? match.adversaire : "ASC Yaakar";
  const homeScore = match.domicile ? match.score_yaakar : match.score_adverse;
  const awayScore = match.domicile ? match.score_adverse : match.score_yaakar;
  const played = match.status === "termine";
  const dateStr = match.date
    ? new Date(match.date).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : "";

  return (
    <div className="flex items-center gap-4 rounded-xl border border-charcoal-line bg-charcoal px-5 py-4">
      <div className="w-24 shrink-0 text-xs text-bone-dim">
        <p>{dateStr}</p>
        {match.lieu && <p className="truncate">{match.lieu}</p>}
      </div>
      <div className="flex flex-1 items-center justify-center gap-3">
        <span
          className={`w-32 truncate text-right font-display text-base ${
            match.domicile ? "text-gold-bright" : "text-bone"
          }`}
        >
          {home}
        </span>
        <span className="font-score text-lg font-bold text-bone">
          {played ? `${homeScore ?? "-"} : ${awayScore ?? "-"}` : "vs"}
        </span>
        <span
          className={`w-32 truncate text-left font-display text-base ${
            !match.domicile ? "text-gold-bright" : "text-bone"
          }`}
        >
          {away}
        </span>
      </div>
      <span className={`w-20 shrink-0 text-right text-xs font-semibold uppercase tracking-wider ${statusColor(match.status)}`}>
        {statusLabel(match.status)}
      </span>
    </div>
  );
}
