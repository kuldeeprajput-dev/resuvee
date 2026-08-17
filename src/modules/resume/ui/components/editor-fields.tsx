"use client";

import { GripVertical, Lightbulb, Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FieldProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  label: string;
  hint?: string;
  action?: React.ReactNode;
  onChange: (value: string) => void;
}

export function Field({ label, hint, action, className, onChange, ...props }: FieldProps) {
  return (
    <div className={cn("block space-y-2", className)}>
      <div className="flex items-center justify-between gap-3 text-xs font-bold text-(--brand-ink)">
        <span>{label}</span>
        <span className="flex items-center gap-2">
          {hint && <span className="font-medium text-(--brand-muted)">{hint}</span>}
          {action}
        </span>
      </div>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-black/10 bg-white px-3.5 text-sm text-(--brand-ink) shadow-sm outline-none transition placeholder:text-black/30 focus:border-[#315f45]/50 focus:ring-3 focus:ring-[#315f45]/10"
      />
    </div>
  );
}

interface TextAreaFieldProps extends Omit<React.ComponentProps<"textarea">, "onChange"> {
  label: string;
  hint?: string;
  onChange: (value: string) => void;
}

export function TextAreaField({ label, hint, className, onChange, ...props }: TextAreaFieldProps) {
  return (
    <label className={cn("block space-y-2", className)}>
      <span className="flex items-center justify-between gap-3 text-xs font-bold text-(--brand-ink)">
        {label}
        {hint && <span className="font-medium text-(--brand-muted)">{hint}</span>}
      </span>
      <textarea
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-y rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm leading-6 text-(--brand-ink) shadow-sm outline-none transition placeholder:text-black/30 focus:border-[#315f45]/50 focus:ring-3 focus:ring-[#315f45]/10"
      />
    </label>
  );
}

interface EditorSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function EditorSection({
  eyebrow,
  title,
  description,
  children,
  action,
}: EditorSectionProps) {
  return (
    <div className="mx-auto w-full max-w-2xl px-3 pb-16 pt-3 sm:px-7 sm:pb-28 sm:pt-7">
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-7 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#315f45] sm:text-[11px] sm:tracking-[0.18em]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 text-lg font-bold tracking-tight text-(--brand-ink) sm:mt-1 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-xs leading-5 text-(--brand-muted) sm:mt-1.5 sm:text-sm sm:leading-6">
            {description}
          </p>
        </div>
        {action && <div className="shrink-0 self-start sm:pt-1">{action}</div>}
      </div>
      {children}
    </div>
  );
}

interface ItemCardProps {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: React.ReactNode;
  canRemove?: boolean;
}

export function ItemCard({
  title,
  subtitle,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
  canRemove = true,
}: ItemCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-black/9 bg-[#fbfaf6] shadow-sm">
      <div className="flex items-center gap-2 border-b border-black/[0.07] bg-white/60 px-3 py-2.5 sm:px-4 sm:py-3">
        <GripVertical className="size-4 text-black/25 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-xs font-bold text-(--brand-ink) sm:text-sm">{title}</h3>
          {subtitle && (
            <p className="truncate text-[11px] text-(--brand-muted) sm:text-xs">{subtitle}</p>
          )}
        </div>
        {(onMoveUp || onMoveDown) && (
          <div className="flex items-center gap-0.5 mr-1">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={!onMoveUp}
              title="Move item up"
              className="flex size-7 items-center justify-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer sm:size-8"
            >
              <ChevronUp className="size-4" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={!onMoveDown}
              title="Move item down"
              className="flex size-7 items-center justify-center rounded-lg text-black/40 transition hover:bg-black/5 hover:text-black disabled:opacity-20 disabled:pointer-events-none cursor-pointer sm:size-8"
            >
              <ChevronDown className="size-4" />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          aria-label={`Remove ${title}`}
          className="flex size-7 items-center justify-center rounded-lg text-black/35 transition hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-25 sm:size-8 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
      <div className="space-y-3 p-3 sm:space-y-4 sm:p-4">{children}</div>
    </article>
  );
}

export function AddItemButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 bg-white/50 text-sm font-bold text-(--brand-muted) transition hover:border-[#315f45]/40 hover:bg-white hover:text-(--brand-ink)"
    >
      <Plus className="size-4" />
      {children}
    </button>
  );
}

interface BulletEditorProps {
  label?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function BulletEditor({
  label = "Highlights",
  values,
  onChange,
  placeholder = "Describe an achievement and include the outcome…",
}: BulletEditorProps) {
  const updateValue = (index: number, value: string) => {
    onChange(values.map((item, itemIndex) => (itemIndex === index ? value : item)));
  };

  const removeValue = (index: number) => {
    const nextValues = values.filter((_, itemIndex) => itemIndex !== index);
    onChange(nextValues.length ? nextValues : [""]);
  };

  return (
    <div>
      <span className="mb-2 block text-xs font-bold text-(--brand-ink)">{label}</span>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-[17px] size-1.5 shrink-0 rounded-full bg-[#315f45]" />
            <textarea
              value={value}
              onChange={(event) => updateValue(index, event.target.value)}
              placeholder={placeholder}
              rows={2}
              className="min-h-16 flex-1 resize-y rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm leading-5 outline-none transition placeholder:text-black/30 focus:border-[#315f45]/50 focus:ring-3 focus:ring-[#315f45]/10"
            />
            <button
              type="button"
              onClick={() => removeValue(index)}
              aria-label="Remove highlight"
              className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-black/30 transition hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ""])}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#315f45] hover:underline"
      >
        <Plus className="size-3.5" />
        Add highlight
      </button>
    </div>
  );
}

export function WritingTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-[#d9c887] bg-[#fff9df] p-3.5 text-xs leading-5 text-[#655826]">
      <Lightbulb className="mt-0.5 size-4 shrink-0" />
      <p>{children}</p>
    </div>
  );
}
