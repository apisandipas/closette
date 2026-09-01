import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createUploadUrl } from "@/features/items/api/service";
import { useFieldContext, useFormContext } from "@/lib/form-context";
import { resizeToWebp } from "@/lib/storage/resize-image";
import { MAX_IMAGE_BYTES } from "@/lib/storage/constants";
import { useServerFn } from "@tanstack/react-start";
import { PipetteIcon } from "lucide-react";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

function FieldErrors() {
  const field = useFieldContext();
  if (field.state.meta.isValid) return null;
  return (
    <p className="text-destructive text-sm">
      {field.state.meta.errors.map((e) => e?.message).join(", ")}
    </p>
  );
}

export function TextField({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
      />
      <FieldErrors />
    </Field>
  );
}

export function NumberField({ label }: { label: string }) {
  const field = useFieldContext<number>();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        type="number"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.valueAsNumber || 0)}
        onBlur={field.handleBlur}
      />
      <FieldErrors />
    </Field>
  );
}

export function SelectField({
  label,
  placeholder,
  options,
}: {
  label: string;
  placeholder: string;
  options: Array<{ id: string; name: string }>;
}) {
  const field = useFieldContext<string>();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <select
        id={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="h-9 w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm"
      >
        <option value="">{placeholder}</option>
        {options?.map(({ id, name }) => (
          <option key={id} value={id}>
            {name}
          </option>
        ))}
      </select>
      <FieldErrors />
    </Field>
  );
}

export function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
      {([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Saving…" : label}
        </Button>
      )}
    </form.Subscribe>
  );
}

export function ColorField({ label }: { label: string }) {
  const field = useFieldContext<string>();
  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover>
        <div className="flex h-9 w-full items-center gap-2 rounded-3xl border border-transparent bg-input/50 px-3 transition-[color,box-shadow,background-color] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30">
          {/* rendered current color */}
          <span
            aria-hidden="true"
            className="size-5 shrink-0 rounded-full border"
            style={{ backgroundColor: field.state.value || "transparent" }}
          />
          {/* hex, editable by hand too */}
          <input
            id={field.name}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            placeholder="#000000"
            className="min-w-0 flex-1 bg-transparent text-base outline-none md:text-sm"
          />
          {/* picker trigger */}
          <PopoverTrigger
            aria-label="Pick a color"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <PipetteIcon className="size-4" />
          </PopoverTrigger>
        </div>
        <PopoverContent>
          <HexColorPicker
            color={field.state.value}
            onChange={field.handleChange}
          />
        </PopoverContent>
      </Popover>
      <FieldErrors />
    </Field>
  );
}

export function ImageField({
  label,
  currentUrl,
}: {
  label: string;
  currentUrl?: string | null;
}) {
  const field = useFieldContext<string>();
  const getUploadUrl = useServerFn(createUploadUrl);

  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shown = preview ?? currentUrl ?? null;

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // so the same file can be picked again after an error
    if (!file) return;

    setBusy(true);
    setError(null);

    try {
      const blob = await resizeToWebp(file);
      if (blob.size > MAX_IMAGE_BYTES) throw new Error("That image is too big");

      const { key, url } = await getUploadUrl({
        data: { contentType: "image/webp" },
      });

      // The Content-Type must match what was signed or B2 rejects the
      // signature with a 403 that says nothing useful.
      const res = await fetch(url, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": "image/webp" },
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);

      field.handleChange(key);
      setPreview((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(blob);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Field>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="flex items-center gap-3">
        {shown && (
          <img
            src={shown}
            alt=""
            className="size-16 shrink-0 rounded-lg border object-cover"
          />
        )}
        <input
          id={field.name}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onPick}
          onBlur={field.handleBlur}
          disabled={busy}
          className="text-sm"
        />
      </div>
      {busy && <p className="text-muted-foreground text-sm">Uploading…</p>}
      {error && <p className="text-destructive text-sm">{error}</p>}
      <FieldErrors />
    </Field>
  );
}
