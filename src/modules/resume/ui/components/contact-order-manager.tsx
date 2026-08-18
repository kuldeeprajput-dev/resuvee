"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  RotateCcw,
  GripVertical,
  Mail,
  Phone,
  MapPin,
  Globe2,
} from "lucide-react";
import type { ResumeData } from "../../types/resume";
import {
  getCustomLinkIcon,
  LinkedinIcon,
  GithubIcon,
} from "../../constants/custom-link-icons";
import { cn } from "@/shared/lib/utils";

interface ContactOrderManagerProps {
  data: ResumeData;
  onUpdateOrder: (order: string[]) => void;
}

export function ContactOrderManager({
  data,
  onUpdateOrder,
}: ContactOrderManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const getDisplayValue = (key: string, fallbackValue?: string, defaultShort?: string) => {
    const custom = data.basics.customLabels?.[key];
    if (custom && custom.trim().length > 0) {
      return custom.trim();
    }
    return fallbackValue || defaultShort || "";
  };

  const allAvailableItemsMap: Record<
    string,
    {
      id: string;
      label: string;
      value: string;
      icon: React.ComponentType<{ className?: string }>;
    }
  > = {
    email: {
      id: "email",
      label: "Email",
      value: getDisplayValue("email", data.basics.email, "Email"),
      icon: Mail,
    },
    phone: {
      id: "phone",
      label: "Phone",
      value: getDisplayValue("phone", data.basics.phone, "Phone"),
      icon: Phone,
    },
    location: {
      id: "location",
      label: "Location",
      value: getDisplayValue("location", data.basics.location, "Location"),
      icon: MapPin,
    },
    linkedin: {
      id: "linkedin",
      label: "LinkedIn",
      value: getDisplayValue("linkedin", data.basics.linkedin, "LinkedIn"),
      icon: LinkedinIcon,
    },
    github: {
      id: "github",
      label: "GitHub",
      value: getDisplayValue("github", data.basics.github, "GitHub"),
      icon: GithubIcon,
    },
    website: {
      id: "website",
      label: "Portfolio",
      value: getDisplayValue("website", data.basics.website, "Portfolio"),
      icon: Globe2,
    },
  };

  (data.basics.customLinks || []).forEach((link) => {
    if (link.id) {
      allAvailableItemsMap[link.id] = {
        id: link.id,
        label: link.label?.trim() || "Custom Link",
        value: link.label?.trim() || link.url?.replace(/^https?:\/\/(www\.)?/, "") || "Custom Link",
        icon: getCustomLinkIcon(link.icon),
      };
    }
  });

  const defaultOrder = [
    "email",
    "phone",
    "location",
    "linkedin",
    "github",
    "website",
    ...(data.basics.customLinks || []).map((l) => l.id),
  ];

  const currentOrder =
    data.basics.contactOrder && data.basics.contactOrder.length > 0
      ? [
          ...data.basics.contactOrder.filter((id) => id in allAvailableItemsMap),
          ...defaultOrder.filter(
            (id) => !data.basics.contactOrder!.includes(id) && id in allAvailableItemsMap
          ),
        ]
      : defaultOrder;

  const activeItems = currentOrder
    .map((id) => allAvailableItemsMap[id])
    .filter((item) => item && item.value && item.value.trim().length > 0);

  const reorderActiveItems = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const nextActiveOrder = activeItems.map((i) => i.id);
    const [moved] = nextActiveOrder.splice(fromIndex, 1);
    nextActiveOrder.splice(toIndex, 0, moved);

    const remaining = defaultOrder.filter((id) => !nextActiveOrder.includes(id));
    onUpdateOrder([...nextActiveOrder, ...remaining]);
  };

  const handleReset = () => {
    onUpdateOrder(defaultOrder);
  };

  if (activeItems.length <= 1) return null;

  return (
    <div className="mt-4 rounded-2xl bg-white overflow-hidden shadow-2xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white hover:bg-black/[0.02] transition cursor-pointer text-left"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="size-3.5 text-emerald-700 shrink-0" />
          <div>
            <span className="text-xs font-bold text-(--brand-ink)">Contact & Links Display Order</span>
            <span className="ml-2 rounded-md bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9.5px] font-bold">
              {activeItems.length} active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-(--brand-muted)">
          <span>{isOpen ? "Hide order" : "Drag to rearrange"}</span>
          <ChevronDown className={cn("size-3.5 transition-transform", isOpen && "rotate-180")} />
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-2 border-t border-black/6 bg-white">
          <p className="text-[11px] text-(--brand-muted) mb-2">
            Drag items up or down to set the exact order they appear on your resume.
          </p>

          <div className="space-y-1.5">
            {activeItems.map((item, index) => {
              const ItemIcon = item.icon;
              const isBeingDragged = draggedIndex === index;
              const isDragOver = dragOverIndex === index && draggedIndex !== index;

              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", `${index}`);
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex !== null && draggedIndex !== index) {
                      reorderActiveItems(draggedIndex, index);
                    }
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  onDragEnd={() => {
                    setDraggedIndex(null);
                    setDragOverIndex(null);
                  }}
                  className={cn(
                    "group flex items-center justify-between gap-2.5 rounded-xl border border-black/8 bg-[#fbfaf6] px-3 py-2.5 shadow-2xs transition-all select-none cursor-grab active:cursor-grabbing",
                    isBeingDragged &&
                      "opacity-40 scale-[0.98] border-dashed border-emerald-500 bg-emerald-50/50",
                    isDragOver &&
                      "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/70 scale-[1.01]"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <GripVertical className="size-4 text-black/30 group-hover:text-emerald-700 shrink-0 transition" />
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-800 text-[10px] font-extrabold border border-emerald-200">
                      #{index + 1}
                    </span>
                    <ItemIcon className="size-3.5 text-black/50 shrink-0" />
                    <div className="min-w-0 flex-1 truncate">
                      <span className="text-xs font-bold text-(--brand-ink) mr-1.5">{item.label}:</span>
                      <span className="text-xs text-(--brand-muted)">{item.value}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-black/30 group-hover:text-emerald-800 transition shrink-0">
                    Drag
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-black/8 mt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-(--brand-muted) hover:text-(--brand-ink) transition cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Reset to default order</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
