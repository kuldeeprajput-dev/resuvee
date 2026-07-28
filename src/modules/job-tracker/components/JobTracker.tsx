"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  ChevronRight,
  CirclePlus,
  ExternalLink,
  MapPin,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Brand } from "@/shared/components/layout/SiteHeader";
import { Button } from "@/shared/components/ui/button";
import type {
  ApplicationStatus,
  JobApplication,
} from "../types/application";

const STORAGE_KEY = "resulyra-applications-v1";

const columns: {
  id: ApplicationStatus;
  label: string;
  description: string;
  color: string;
}[] = [
  {
    id: "saved",
    label: "Saved",
    description: "Worth exploring",
    color: "#6f7771",
  },
  {
    id: "applied",
    label: "Applied",
    description: "Waiting for response",
    color: "#38709b",
  },
  {
    id: "interview",
    label: "Interviewing",
    description: "Active conversations",
    color: "#8a6231",
  },
  {
    id: "offer",
    label: "Offer",
    description: "Decision time",
    color: "#4f7946",
  },
];

const emptyApplication: Omit<JobApplication, "id" | "createdAt"> = {
  company: "",
  role: "",
  location: "",
  link: "",
  status: "saved",
  nextStep: "",
  dueDate: "",
  notes: "",
};

export function JobTracker() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [creating, setCreating] = useState(false);
  const [saveLabel, setSaveLabel] = useState("Saved locally");
  const hasLoaded = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as JobApplication[];
        if (Array.isArray(parsed)) setApplications(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoaded.current) return;
    setSaveLabel("Saving…");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(applications),
      );
      setSaveLabel("Saved locally");
    }, 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [applications]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return applications;
    return applications.filter((item) =>
      [item.company, item.role, item.location, item.notes]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [applications, query]);

  const saveApplication = (
    draft: Omit<JobApplication, "id" | "createdAt">,
  ) => {
    if (editing) {
      setApplications((items) =>
        items.map((item) =>
          item.id === editing.id ? { ...item, ...draft } : item,
        ),
      );
      setEditing(null);
      return;
    }

    setApplications((items) => [
      ...items,
      {
        ...draft,
        id: `application-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    ]);
    setCreating(false);
  };

  const moveApplication = (
    application: JobApplication,
    status: ApplicationStatus,
  ) => {
    setApplications((items) =>
      items.map((item) =>
        item.id === application.id ? { ...item, status } : item,
      ),
    );
  };

  const removeApplication = (application: JobApplication) => {
    const confirmed = window.confirm(
      `Remove ${application.role} at ${application.company} from your tracker?`,
    );
    if (!confirmed) return;
    setApplications((items) =>
      items.filter((item) => item.id !== application.id),
    );
    setEditing(null);
  };

  return (
    <div className="min-h-[100dvh] bg-[#f0f1ec] text-[var(--brand-ink)]">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[var(--brand-paper)]/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              aria-label="Back to home"
              className="builder-icon-button lg:hidden"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="hidden lg:block">
              <Brand />
            </div>
            <span className="hidden h-6 w-px bg-black/10 lg:block" />
            <div>
              <p className="text-sm font-bold">Application board</p>
              <p className="mt-0.5 text-[10px] font-semibold text-[var(--brand-muted)]">
                {saveLabel} · {applications.length}{" "}
                {applications.length === 1 ? "opportunity" : "opportunities"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => setCreating(true)}
            className="h-10 rounded-xl bg-[var(--brand-ink)] px-4 font-bold text-white"
          >
            <CirclePlus className="size-4" />
            Add opportunity
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-7 sm:px-6 lg:py-9">
        <section className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#bd593a]">
              Your search workspace
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-[-0.045em] sm:text-4xl">
              Keep every next step visible.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--brand-muted)]">
              Track roles from first save to final decision without a
              spreadsheet. Your board remains in this browser until you add
              an account later.
            </p>
          </div>
          <label className="flex h-11 min-w-[280px] items-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 shadow-sm">
            <Search className="size-4 text-[var(--brand-muted)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company, role, or note"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            />
          </label>
        </section>

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {columns.map((column) => {
            const count = applications.filter(
              (item) => item.status === column.id,
            ).length;
            return (
              <div
                key={column.id}
                className="rounded-2xl border border-black/[0.07] bg-white/70 p-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: column.color }}
                  />
                  <span className="text-xl font-bold tracking-[-0.04em]">
                    {count}
                  </span>
                </div>
                <p className="mt-3 text-xs font-bold">{column.label}</p>
                <p className="mt-1 text-[10px] text-[var(--brand-muted)]">
                  {column.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-6 grid min-w-0 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column) => {
            const items = filtered.filter(
              (application) => application.status === column.id,
            );
            return (
              <div
                key={column.id}
                className="min-w-0 rounded-3xl border border-black/[0.08] bg-[#e7e8e3] p-3"
              >
                <header className="flex items-center justify-between px-2 py-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: column.color }}
                    />
                    <h2 className="text-xs font-bold">{column.label}</h2>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-[var(--brand-muted)]">
                    {items.length}
                  </span>
                </header>

                <div className="mt-2 space-y-3">
                  {items.map((application) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      onEdit={() => setEditing(application)}
                      onMove={(status) =>
                        moveApplication(application, status)
                      }
                    />
                  ))}
                  {!items.length && (
                    <button
                      type="button"
                      onClick={() => setCreating(true)}
                      className="flex min-h-28 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/35 p-4 text-center transition hover:bg-white/65"
                    >
                      <CirclePlus className="size-5 text-black/30" />
                      <span className="mt-2 text-[11px] font-semibold text-[var(--brand-muted)]">
                        {query ? "No matching roles" : `Add to ${column.label}`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {!applications.length && !query && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-[var(--brand-ink)] p-6 text-white sm:p-8">
            <div className="grid gap-6 sm:grid-cols-[auto_1fr_auto] sm:items-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[var(--brand-lime)]">
                <BriefcaseBusiness className="size-6" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Build your first pipeline</h2>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Add a role you are considering, record the next action, and
                  move it across the board as the conversation progresses.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setCreating(true)}
                className="h-11 rounded-xl bg-[var(--brand-lime)] px-5 font-bold text-[var(--brand-ink)] hover:bg-[#b4d968]"
              >
                Add first role
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </section>
        )}
      </main>

      {(creating || editing) && (
        <ApplicationDialog
          application={editing}
          onSave={saveApplication}
          onDelete={
            editing ? () => removeApplication(editing) : undefined
          }
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ApplicationCard({
  application,
  onEdit,
  onMove,
}: {
  application: JobApplication;
  onEdit: () => void;
  onMove: (status: ApplicationStatus) => void;
}) {
  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-ink)] text-sm font-bold uppercase text-white">
          {application.company.slice(0, 1) || "?"}
        </span>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${application.role}`}
          className="builder-icon-button"
        >
          <Pencil className="size-3.5" />
        </button>
      </div>
      <h3 className="mt-4 text-sm font-bold leading-5">
        {application.role}
      </h3>
      <p className="mt-1 text-xs font-semibold text-[var(--brand-muted)]">
        {application.company}
      </p>
      {application.location && (
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-black/45">
          <MapPin className="size-3" />
          {application.location}
        </p>
      )}

      {(application.nextStep || application.dueDate) && (
        <div className="mt-4 rounded-xl bg-[#f2f3ee] p-3">
          <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8a6231]">
            <CalendarClock className="size-3" />
            Next step
          </p>
          <p className="mt-1.5 text-[11px] font-semibold leading-4">
            {application.nextStep || "Follow up"}
          </p>
          {application.dueDate && (
            <p className="mt-1 text-[9px] text-[var(--brand-muted)]">
              Due {application.dueDate}
            </p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <select
          aria-label={`Move ${application.role}`}
          value={application.status}
          onChange={(event) =>
            onMove(event.target.value as ApplicationStatus)
          }
          className="h-9 min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-2 text-[10px] font-bold outline-none"
        >
          {columns.map((column) => (
            <option key={column.id} value={column.id}>
              {column.label}
            </option>
          ))}
        </select>
        {application.link && (
          <a
            href={
              application.link.startsWith("http")
                ? application.link
                : `https://${application.link}`
            }
            target="_blank"
            rel="noreferrer"
            aria-label="Open job listing"
            className="builder-icon-button"
          >
            <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}

function ApplicationDialog({
  application,
  onSave,
  onDelete,
  onClose,
}: {
  application: JobApplication | null;
  onSave: (draft: Omit<JobApplication, "id" | "createdAt">) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<
    Omit<JobApplication, "id" | "createdAt">
  >(application ?? emptyApplication);

  const update = (
    field: keyof Omit<JobApplication, "id" | "createdAt">,
    value: string,
  ) => setDraft((current) => ({ ...current, [field]: value }));

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/35 backdrop-blur-sm sm:items-center sm:p-5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close opportunity editor"
        className="absolute inset-0 cursor-default"
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.company.trim() || !draft.role.trim()) return;
          onSave(draft);
        }}
        className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#f8f7f2] p-5 shadow-2xl sm:rounded-3xl sm:p-7"
      >
        <header className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#bd593a]">
              {application ? "Update opportunity" : "New opportunity"}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-[-0.04em]">
              {application ? "Keep the next step current" : "Add a role"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="builder-icon-button"
            aria-label="Close opportunity editor"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <DialogField
            label="Company"
            value={draft.company}
            onChange={(value) => update("company", value)}
            placeholder="Northstar Labs"
            required
          />
          <DialogField
            label="Role"
            value={draft.role}
            onChange={(value) => update("role", value)}
            placeholder="Product manager"
            required
          />
          <DialogField
            label="Location"
            value={draft.location}
            onChange={(value) => update("location", value)}
            placeholder="Remote or city"
          />
          <DialogField
            label="Job link"
            value={draft.link}
            onChange={(value) => update("link", value)}
            placeholder="company.com/jobs/role"
          />
          <label className="block">
            <span className="dialog-label">Stage</span>
            <select
              value={draft.status}
              onChange={(event) => update("status", event.target.value)}
              className="dialog-input"
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.label}
                </option>
              ))}
            </select>
          </label>
          <DialogField
            label="Due date"
            value={draft.dueDate}
            onChange={(value) => update("dueDate", value)}
            type="date"
          />
          <div className="sm:col-span-2">
            <DialogField
              label="Next step"
              value={draft.nextStep}
              onChange={(value) => update("nextStep", value)}
              placeholder="Send follow-up, prepare case study…"
            />
          </div>
          <label className="block sm:col-span-2">
            <span className="dialog-label">Notes</span>
            <textarea
              value={draft.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Contacts, interview context, questions, compensation notes…"
              className="min-h-28 w-full resize-y rounded-xl border border-black/10 bg-white px-3.5 py-3 text-sm leading-6 outline-none focus:border-[#537c45] focus:ring-3 focus:ring-[#a8ca59]/20"
            />
          </label>
        </div>

        <footer className="mt-7 flex items-center justify-between gap-3 border-t border-black/10 pt-5">
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              onClick={onDelete}
              className="h-11 rounded-xl px-3 font-bold text-[#a04435] hover:bg-[#f7e9e5]"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 rounded-xl border-black/10 px-4 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-11 rounded-xl bg-[var(--brand-ink)] px-5 font-bold text-white"
            >
              <Check className="size-4" />
              Save role
            </Button>
          </div>
        </footer>
      </form>
    </div>
  );
}

function DialogField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="dialog-label">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="dialog-input"
      />
    </label>
  );
}
