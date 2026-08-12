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
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-6">
        <div className="text-right">
          <p className="font-display text-lg leading-none text-bone md:text-2xl">
            {home}
          </p>
        </div>
        <div className="flex items-center gap-2 font-score text-3xl font-bold text-gold-bright scoreboard-digit md:text-4xl">
          <span>{played ? homeScore ?? "-" : "—"}</span>
          <span className="text-bone-dim">:</span>
          <span>{played ? awayScore ?? "-" : "—"}</span>
        </div>
        <div className="text-left">
          <p className="font-display text-lg leading-none text-bone md:text-2xl">
            {away}
          </p>
        </div>
      </div>
      <div className="border-t border-charcoal-line px-4 py-2 text-center text-xs text-bone-dim">
        {dateStr}
        {match.lieu ? ` · ${match.lieu}` : ""}
      </div>
    </div>
  );
}
