import { getAllMatches, getAllPlayers, getAllNews } from "@/lib/data";
import GoalsEditor from "@/components/GoalsEditor";
import ImagesEditor from "@/components/ImagesEditor";
import PhotoInput from "@/components/PhotoInput";
import {
  logoutAction,
  createMatchAction,
  updateMatchAction,
  deleteMatchAction,
  createPlayerAction,
  updatePlayerAction,
  deletePlayerAction,
  createNewsAction,
  updateNewsAction,
  deleteNewsAction,
} from "@/app/admin/actions";

export const metadata = { title: "Dashboard admin — ASC Yaakar" };

export default async function DashboardPage() {
  let matches = [],
    players = [],
    news = [];
  try {
    [matches, players, news] = await Promise.all([
      getAllMatches(),
      getAllPlayers(),
      getAllNews(),
    ]);
  } catch (e) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-14">
        <h1 className="font-display text-2xl text-bone">
          Connexion à la base de données impossible
        </h1>
        <p className="mt-3 text-sm text-bone-dim">
          Vérifie que la variable d&apos;environnement{" "}
          <code className="rounded bg-charcoal px-1.5 py-0.5">MONGODB_URI</code>{" "}
          est bien configurée sur Vercel.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <div className="flex items-center justify-between border-b border-charcoal-line pb-6">
        <div>
          <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
            Espace admin
          </p>
          <h1 className="mt-1 font-display text-3xl tracking-wide text-bone">
            Dashboard
          </h1>
        </div>
        <form action={logoutAction}>
          <button className="rounded-md border border-charcoal-line px-4 py-2 text-sm text-bone-dim hover:border-gold hover:text-gold-bright">
            Se déconnecter
          </button>
        </form>
      </div>

      <MatchesSection matches={matches} players={players} />
      <PlayersSection players={players} />
      <NewsSection news={news} />
    </div>
  );
}

/* ---------------- UI HELPERS ---------------- */

function SectionTitle({ children }) {
  return (
    <h2 className="mt-14 mb-4 font-display text-2xl tracking-wide text-gold-bright">
      {children}
    </h2>
  );
}

function Field({ label, children }) {
  return (
    <label className="block min-w-0 text-sm">
      <span className="text-bone-dim">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "mt-1 w-full min-w-0 max-w-full box-border rounded-md border border-charcoal-line bg-ink px-3 py-2 text-sm text-bone outline-none focus:border-gold";

/* ---------------- MATCHS ---------------- */

function MatchesSection({ matches, players }) {
  return (
    <section>
      <SectionTitle>Matchs</SectionTitle>

      <div className="space-y-3">
        {matches.map((m) => (
          <details
            key={`${m._id}:${m.adversaire}:${m.domicile}:${m.date}:${m.lieu}:${m.poule}:${m.status}:${m.score_yaakar}:${m.score_adverse}:${JSON.stringify(m.buteurs)}`}
            className="rounded-xl border border-charcoal-line bg-charcoal p-4"
          >
            <summary className="cursor-pointer font-display text-base text-bone">
              {m.domicile ? "ASC Yaakar" : m.adversaire} vs{" "}
              {m.domicile ? m.adversaire : "ASC Yaakar"} —{" "}
              <span className="text-gold-bright">
                {m.date ? new Date(m.date).toLocaleDateString("fr-FR") : ""}
              </span>
            </summary>
            <form
              action={updateMatchAction.bind(null, m._id)}
              className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2"
            >
              <MatchFields defaults={m} players={players} />
              <div className="col-span-full pt-2">
                <SubmitBtn>Enregistrer</SubmitBtn>
              </div>
            </form>
            <DeleteBtn action={deleteMatchAction.bind(null, m._id)} />
          </details>
        ))}
      </div>

      <details className="mt-4 rounded-xl border border-charcoal-line bg-charcoal p-4">
        <summary className="cursor-pointer font-display text-base text-gold-bright">
          + Ajouter un match
        </summary>
        <form action={createMatchAction} className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
          <MatchFields players={players} />
          <div className="col-span-full pt-2">
            <SubmitBtn>Ajouter</SubmitBtn>
          </div>
        </form>
      </details>
    </section>
  );
}

function MatchFields({ defaults = {}, players = [] }) {
  return (
    <>
      <Field label="Adversaire">
        <input
          name="adversaire"
          defaultValue={defaults.adversaire}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Domicile ?">
        <select
          name="domicile"
          defaultValue={String(defaults.domicile ?? "true")}
          className={inputClass}
        >
          <option value="true">Domicile</option>
          <option value="false">Extérieur</option>
        </select>
      </Field>
      <Field label="Date">
        <input
          type="date"
          name="date"
          defaultValue={defaults.date ? defaults.date.substring(0, 10) : ""}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Lieu">
        <input name="lieu" defaultValue={defaults.lieu} className={inputClass} />
      </Field>
      <Field label="Poule / groupe">
        <input name="poule" defaultValue={defaults.poule} className={inputClass} />
      </Field>
      <Field label="Statut">
        <select
          name="status"
          defaultValue={defaults.status ?? "a_venir"}
          className={inputClass}
        >
          <option value="a_venir">À venir</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>
      </Field>
      <Field label="Score ASC Yaakar">
        <input
          type="number"
          name="score_yaakar"
          defaultValue={defaults.score_yaakar ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Score adverse">
        <input
          type="number"
          name="score_adverse"
          defaultValue={defaults.score_adverse ?? ""}
          className={inputClass}
        />
      </Field>
      <GoalsEditor players={players} defaultGoals={defaults.buteurs || []} />
    </>
  );
}

/* ---------------- JOUEURS ---------------- */

function PlayersSection({ players }) {
  return (
    <section>
      <SectionTitle>Effectif</SectionTitle>

      <div className="space-y-3">
        {players.map((p) => (
          <details
            key={`${p._id}:${p.nom}:${p.poste}:${p.numero}:${p.photo}:${p.bio}`}
            className="rounded-xl border border-charcoal-line bg-charcoal p-4"
          >
            <summary className="cursor-pointer font-display text-base text-bone">
              #{p.numero ?? "—"} {p.nom}{" "}
              <span className="text-gold-bright">— {p.poste}</span>
            </summary>
            <form
              action={updatePlayerAction.bind(null, p._id)}
              className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2"
            >
              <PlayerFields defaults={p} />
              <div className="col-span-full pt-2">
                <SubmitBtn>Enregistrer</SubmitBtn>
              </div>
            </form>
            <DeleteBtn action={deletePlayerAction.bind(null, p._id)} />
          </details>
        ))}
      </div>

      <details className="mt-4 rounded-xl border border-charcoal-line bg-charcoal p-4">
        <summary className="cursor-pointer font-display text-base text-gold-bright">
          + Ajouter un joueur
        </summary>
        <form action={createPlayerAction} className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2">
          <PlayerFields />
          <div className="col-span-full pt-2">
            <SubmitBtn>Ajouter</SubmitBtn>
          </div>
        </form>
      </details>
    </section>
  );
}

function PlayerFields({ defaults = {} }) {
  return (
    <>
      <Field label="Nom">
        <input name="nom" defaultValue={defaults.nom} required className={inputClass} />
      </Field>
      <Field label="Poste">
        <input
          name="poste"
          defaultValue={defaults.poste}
          placeholder="Gardien, Défenseur, Milieu, Attaquant…"
          className={inputClass}
        />
      </Field>
      <Field label="Numéro">
        <input
          type="number"
          name="numero"
          defaultValue={defaults.numero ?? ""}
          className={inputClass}
        />
      </Field>
      <Field label="Photo">
        <PhotoInput defaultPhoto={defaults.photo} />
      </Field>
      <div className="col-span-full">
        <Field label="Bio (optionnel)">
          <textarea
            name="bio"
            defaultValue={defaults.bio}
            rows={2}
            className={inputClass}
          />
        </Field>
      </div>
    </>
  );
}

/* ---------------- ACTUS ---------------- */

function NewsSection({ news }) {
  return (
    <section>
      <SectionTitle>Actu du quartier</SectionTitle>

      <div className="space-y-3">
        {news.map((n) => (
          <details
            key={`${n._id}:${n.titre}:${n.resume}:${JSON.stringify(n.images)}:${n.contenu}`}
            className="rounded-xl border border-charcoal-line bg-charcoal p-4"
          >
            <summary className="cursor-pointer font-display text-base text-bone">
              {n.titre}
            </summary>
            <form
              action={updateNewsAction.bind(null, n._id)}
              className="mt-4 grid min-w-0 gap-3"
            >
              <NewsFields defaults={n} />
              <div className="pt-2">
                <SubmitBtn>Enregistrer</SubmitBtn>
              </div>
            </form>
            <DeleteBtn action={deleteNewsAction.bind(null, n._id)} />
          </details>
        ))}
      </div>

      <details className="mt-4 rounded-xl border border-charcoal-line bg-charcoal p-4">
        <summary className="cursor-pointer font-display text-base text-gold-bright">
          + Ajouter un article
        </summary>
        <form action={createNewsAction} className="mt-4 grid min-w-0 gap-3">
          <NewsFields />
          <div className="pt-2">
            <SubmitBtn>Publier</SubmitBtn>
          </div>
        </form>
      </details>
    </section>
  );
}

function NewsFields({ defaults = {} }) {
  return (
    <>
      <Field label="Titre">
        <input
          name="titre"
          defaultValue={defaults.titre}
          required
          className={inputClass}
        />
      </Field>
      <Field label="Résumé (affiché en aperçu)">
        <input name="resume" defaultValue={defaults.resume} className={inputClass} />
      </Field>
      <ImagesEditor defaultImages={defaults.images || []} />
      <Field label="Contenu">
        <textarea
          name="contenu"
          defaultValue={defaults.contenu}
          rows={6}
          className={inputClass}
        />
      </Field>
    </>
  );
}

/* ---------------- BUTTONS ---------------- */

function SubmitBtn({ children }) {
  return (
    <button
      type="submit"
      className="rounded-md bg-gold px-4 py-2 text-sm font-semibold text-ink hover:bg-gold-bright"
    >
      {children}
    </button>
  );
}

function DeleteBtn({ action }) {
  return (
    <form action={action} className="mt-2">
      <button
        type="submit"
        className="rounded-md border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950"
      >
        Supprimer
      </button>
    </form>
  );
}