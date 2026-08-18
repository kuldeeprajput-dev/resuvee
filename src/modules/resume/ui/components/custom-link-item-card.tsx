"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import type { ResumeCustomLink } from "../../types/resume";
import { CUSTOM_LINK_ICONS } from "../../constants/custom-link-icons";
import { Field } from "./editor-fields";
import { cn } from "@/shared/lib/utils";

interface CustomLinkItemCardProps {
  item: ResumeCustomLink;
  onUpdate: (updated: ResumeCustomLink) => void;
  onRemove: () => void;
}

export function CustomLinkItemCard({
  item,
  onUpdate,
  onRemove,
}: CustomLinkItemCardProps) {
  const [showPicker, setShowPicker] = useState(false);
  const selectedIcon =
    CUSTOM_LINK_ICONS.find((opt) => opt.id === item.icon) || CUSTOM_LINK_ICONS[0];
  const IconComponent = selectedIcon.icon;

  return (
    <div className="relative rounded-2xl border border-black/10 bg-white/90 p-3.5 shadow-2xs transition hover:border-black/20">
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Icon Selector Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-black/5 px-2.5 py-1.5 text-xs font-semibold text-(--brand-ink) hover:bg-black/10 transition cursor-pointer"
            title="Choose icon for this detail"
          >
            <IconComponent className="size-4 text-emerald-700 shrink-0" />
            <span className="truncate max-w-[130px]">{selectedIcon.name}</span>
            <ChevronDown className="size-3.5 text-black/40" />
          </button>

          {/* Icon Picker Popover */}
          {showPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPicker(false)}
              />
              <div className="absolute left-0 bottom-full mb-2 z-50 w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-black/15 bg-white p-2.5 shadow-2xl grid grid-cols-3 gap-1 max-h-60 overflow-y-auto">
                {CUSTOM_LINK_ICONS.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = opt.id === (item.icon || "globe");
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onUpdate({ ...item, icon: opt.id });
                        setShowPicker(false);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-2 rounded-xl text-center gap-1 transition cursor-pointer",
                        isSelected
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold"
                          : "hover:bg-black/5 text-black/70 hover:text-black"
                      )}
                    >
                      <OptIcon className="size-4 shrink-0" />
                      <span className="text-[10px] leading-tight line-clamp-1">
                        {opt.name.split("/")[0].trim()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Action Button: Delete */}
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg p-1.5 text-black/40 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          title="Remove this item"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Field
          label="Display text (optional)"
          value={item.label || ""}
          onChange={(value) => onUpdate({ ...item, label: value })}
          placeholder="e.g. Portfolio or kuldeeprajput.in"
        />
        <Field
          label="Link URL"
          value={item.url || ""}
          onChange={(value) => onUpdate({ ...item, url: value })}
          placeholder="e.g. https://kuldeeprajput.in"
        />
      </div>
    </div>
  );
}
