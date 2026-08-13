"use client";

import { useState } from "react";

const inputClass =
  "rounded-md border border-charcoal-line bg-ink px-2 py-1.5 text-sm text-bone outline-none focus:border-gold";

export default function GoalsEditor({ players, defaultGoals = [] }) {
  const [goals, setGoals] = useState(
    defaultGoals.length > 0
      ? defaultGoals
      : []
  );

  function addGoal() {
    setGoals([...goals, { joueur: "", minute: "", passeur: "", penalty: false }]);
  }

  function updateGoal(index, field, value) {
    const next = goals.slice();
    next[index] = { ...next[index], [field]: value };
    setGoals(next);
  }

  function removeGoal(index) {
    setGoals(goals.filter((_, i) => i !== index));
  }

  return (
    <div className="col-span-full">
      <p className="mb-2 text-sm text-bone-dim">Buteurs</p>

      {goals.length === 0 && (
        <p className="mb-2 text-xs text-bone-dim/70">Aucun but ajouté.</p>
      )}

      <div className="space-y-2">
        {goals.map((g, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.2fr_0.55fr_1.2fr_auto_auto] items-center gap-2 rounded-md border border-charcoal-line/60 p-2"
          >
            <select
              value={g.joueur}
              onChange={(e) => updateGoal(i, "joueur", e.target.value)}
              className={inputClass}
            >
              <option value="">Buteur…</option>
              {players.map((p) => (
                <option key={p._id} value={p.nom}>
                  {p.nom}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min."
              value={g.minute}
              onChange={(e) => updateGoal(i, "minute", e.target.value)}
              className={inputClass}
            />

            <select
              value={g.passeur}
              onChange={(e) => updateGoal(i, "passeur", e.target.value)}
              className={inputClass}
            >
              <option value="">Passeur (optionnel)</option>
              {players.map((p) => (
                <option key={p._id} value={p.nom}>
                  {p.nom}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1.5 text-xs text-bone-dim">
              <input
                type="checkbox"
                checked={g.penalty || false}
                onChange={(e) => updateGoal(i, "penalty", e.target.checked)}
                className="accent-gold"
              />
              Penalty
            </label>

            <button
              type="button"
              onClick={() => removeGoal(i)}
              className="rounded-md border border-red-900 px-2 py-1.5 text-xs text-red-400 hover:bg-red-950"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addGoal}
        className="mt-2 rounded-md border border-charcoal-line px-3 py-1.5 text-xs font-semibold text-gold-bright hover:border-gold"
      >
        + Ajouter un but
      </button>

      <input type="hidden" name="buteurs" value={JSON.stringify(goals)} />
    </div>
  );
}