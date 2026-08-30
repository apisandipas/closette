import { useFieldContext, useFormContext } from "@/lib/form-context";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  PopoverTrigger,
  Popover,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HexColorPicker } from "react-colorful";
import { PipetteIcon } from "lucide-react";

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
