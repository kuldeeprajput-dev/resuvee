"use client";

import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface EditPlanCardProps {
  suggestions?: string[];
}

export function EditPlanCard({ suggestions }: EditPlanCardProps) {
  const visibleSuggestions = suggestions?.length ? suggestions : ["No suggestions returned."];

  return (
    <Card className="border-[#9dcfc5] bg-[#eaf5f1]/90 py-0 shadow-sm">
      <CardHeader className="border-b border-black/10 p-4">
        <CardTitle className="flex items-center gap-2 text-base text-[#0f5f59]">
          <TrendingUp className="size-4" />
          Edit plan
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ol className="space-y-3">
          {visibleSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--premium-teal) text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5 text-sm leading-6 text-[#123c38]">{suggestion}</span>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
