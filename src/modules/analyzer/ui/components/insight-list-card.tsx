"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface InsightListCardProps {
  title: string;
  icon: LucideIcon;
  items: string[];
  tone: {
    card: string;
    title: string;
    marker: string;
    text: string;
  };
}

export function InsightListCard({ title, icon: Icon, items, tone }: InsightListCardProps) {
  const visibleItems = items.length ? items : ["No items returned."];

  return (
    <Card className={`${tone.card} py-0 shadow-sm`}>
      <CardHeader className="border-b border-black/10 p-4">
        <CardTitle className={`flex items-center gap-2 text-base ${tone.title}`}>
          <Icon className="size-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ul className="space-y-3">
          {visibleItems.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${tone.marker}`} />
              <span className={`text-sm leading-6 ${tone.text}`}>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
