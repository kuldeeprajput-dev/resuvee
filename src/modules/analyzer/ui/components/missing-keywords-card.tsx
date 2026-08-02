"use client";

import { AlertCircle } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface MissingKeywordsCardProps {
  missingKeywords: string[];
}

export function MissingKeywordsCard({ missingKeywords }: MissingKeywordsCardProps) {
  return (
    <Card className="border-[#d9c38b] bg-[#fbf5e6]/90 py-0 shadow-sm">
      <CardHeader className="border-b border-black/10 p-4">
        <CardTitle className="flex items-center gap-2 text-base text-[#6f5520]">
          <AlertCircle className="size-4" />
          Missing keywords
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {missingKeywords.length ? (
            missingKeywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="h-auto min-h-7 max-w-full whitespace-normal rounded-lg border-[#d9c38b] bg-white/80 px-3 text-left text-sm text-[#6f5520]"
              >
                {keyword}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-[#6f5520]">No missing keywords returned.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
