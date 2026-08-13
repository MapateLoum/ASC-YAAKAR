function statusLabel(status) {
  if (status === "termine") return "TERMINÉ";
  if (status === "en_cours") return "EN COURS";
  return "À VENIR";
}

export default function Scoreboard({ match }) {
  if (!match) {
    return (
      <div className="rounded-xl border border-charcoal-line bg-charcoal p-6 text-center text-bone-dim">
        Aucun match programmé pour l&apos;instant.
      </div>
    );
  }

  const home = match.domicile ? "ASC YAAKAR" : match.adversaire;
  const away = match.domicile ? match.adversaire : "ASC YAAKAR";
  const homeScore = match.domicile ? match.score_yaakar : match.score_adverse;
  const awayScore = match.domicile ? match.score_adverse : match.score_yaakar;
  const played = match.status === "termine";

  const dateStr = match.date
    ? new Date(match.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "";

  const buteurs = (match.buteurs || [])
    .slice()
    .sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999));

  return (
    <div className="overflow-hidden rounded-xl border border-charcoal-line bg-charcoal">
      <div className="flex items-center justify-between border-b border-charcoal-line bg-ink-soft px-4 py-2">
        <span className="font-score text-[11px] tracking-widest text-gold-bright">
          {statusLabel(match.status)}
        </span>
        {match.poule && (
          <span className="font-score text-[11px] tracking-widest text-bone-dim">
            {match.poule}
          </span>
        )}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-6 sm:gap-3 sm:px-5">
        <div className="min-w-0 text-right">
          <p className="truncate font-display text-base leading-tight text-bone sm:text-lg md:text-2xl">
            {home}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 font-score text-2xl font-bold text-gold-bright scoreboard-digit sm:gap-2 sm:text-3xl md:text-4xl">
          <span>{played ? homeScore ?? "-" : "—"}</span>
          <span className="text-bone-dim">:</span>
          <span>{played ? awayScore ?? "-" : "—"}</span>
        </div>
        <div className="min-w-0 text-left">
          <p className="truncate font-display text-base leading-tight text-bone sm:text-lg md:text-2xl">
            {away}
          </p>
        </div>
      </div>
      {buteurs.length > 0 && (
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-t border-charcoal-line px-4 py-2 text-xs text-bone-dim">
          {buteurs.map((b, i) => (
            <span key={i}>
              ⚽ <span className="text-bone">{b.joueur}</span>
              {b.minute ? ` ${b.minute}'` : ""}
              {b.penalty && <span className="text-gold-bright"> (P)</span>}
              {b.passeur && <span> (passe : {b.passeur})</span>}
            </span>
          ))}
        </div>
      )}
      <div className="border-t border-charcoal-line px-4 py-2 text-center text-xs text-bone-dim">
        {dateStr}
        {match.lieu ? ` · ${match.lieu}` : ""}
      </div>
    </div>
  );
}