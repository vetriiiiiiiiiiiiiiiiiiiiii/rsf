"use client";

import { useActionState } from "react";
import { uploadMedia, type AdminFormState } from "@/app/actions/admin";
import { SubmitButton } from "@/components/forms/fields";

export function MediaUpload() {
  const [state, action] = useActionState(uploadMedia, { status: "idle" } as AdminFormState);
  return (
    <form action={action} className="grid gap-4 border border-rule p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
      <div>
        <label htmlFor="files" className="text-[0.92rem] font-medium text-ink">
          Images
        </label>
        <input id="files" name="files" type="file" multiple required accept="image/png,image/jpeg,image/webp" className="mt-2 block w-full text-sm file:mr-3 file:border file:border-ink file:bg-white file:px-3 file:py-1.5" />
        <p className="mt-1 text-xs text-muted">PNG, JPEG or WebP · up to 8 MB each · up to 12 at once</p>
      </div>
      <div>
        <label htmlFor="alt" className="text-[0.92rem] font-medium text-ink">
          Alt text
        </label>
        <input id="alt" name="alt" maxLength={200} placeholder="Describe the image for screen readers" className="field-input" />
      </div>
      <SubmitButton pendingLabel="Uploading…">Upload</SubmitButton>
      {state.message ? (
        <p role="status" className={`text-sm md:col-span-3 ${state.status === "error" ? "font-medium text-blue" : "text-ink"}`}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
