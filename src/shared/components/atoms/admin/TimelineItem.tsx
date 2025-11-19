import { formatDate } from "@/utils/projectUtils";
import React from "react";

interface TimelineItemProps {
  label: string;
  date: string | null;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

export function TimelineItem({
  label,
  date,
  icon: Icon,
  isActive = false,
}: TimelineItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`p-2.5 rounded-lg shrink-0 ${
          isActive
            ? "bg-slate-600 text-white"
            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        }`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-semibold ${
            isActive
              ? "text-slate-900 dark:text-slate-50"
              : "text-slate-700 dark:text-slate-300"
          }`}
        >
          {label}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}
