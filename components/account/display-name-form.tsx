"use client";

import { useActionState } from "react";
import { updateDisplayNameAction, type UpdateDisplayNameState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";

const initialState: UpdateDisplayNameState = { error: null, success: false };

export function DisplayNameForm({ current }: { current: string }) {
  const [state, formAction, isPending] = useActionState(updateDisplayNameAction, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <Input
          name="display_name"
          defaultValue={current}
          placeholder="Your name or username"
          className="h-9 text-sm"
          maxLength={40}
        />
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg border border-border bg-base-elevated px-4 py-1.5 text-sm text-content-secondary transition-colors hover:border-border-strong hover:text-content-primary disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
      </div>
      {state.success && (
        <p className="text-xs text-green-400">Display name updated.</p>
      )}
      {state.error && (
        <p className="text-xs text-red-400">{state.error}</p>
      )}
    </form>
  );
}
