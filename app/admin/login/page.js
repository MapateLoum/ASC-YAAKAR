"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const initialState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="hex-field flex min-h-[70vh] items-center justify-center px-5">
      <form
        action={formAction}
        className="w-full max-w-sm rounded-xl border border-charcoal-line bg-charcoal p-8"
      >
        <p className="font-score text-xs uppercase tracking-[0.3em] text-gold-bright">
          Espace admin
        </p>
        <h1 className="mt-2 font-display text-2xl tracking-wide text-bone">
          ASC Yaakar
        </h1>

        <label className="mt-6 block text-sm text-bone-dim" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoFocus
          className="mt-2 w-full rounded-md border border-charcoal-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />

        <label className="mt-4 block text-sm text-bone-dim" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-2 w-full rounded-md border border-charcoal-line bg-ink px-3 py-2 text-bone outline-none focus:border-gold"
        />

        {state?.error && (
          <p className="mt-3 text-sm text-red-400">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 w-full rounded-md bg-gold px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-bright disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
