import { AlertCircle, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ReviewDto } from "@/shared/types/projectTypes";
import { formatDate, formatDateTime, getInitials } from "@/utils/projectUtils";

interface ReviewCardProps {
  review: ReviewDto;
  isLatest: boolean;
}

export function ReviewCard({ review, isLatest }: ReviewCardProps) {
  const isOverdue =
    review.dueAt && !review.reviewedAt && new Date(review.dueAt) < new Date();

  return (
    <Card
      className={`border-slate-200 dark:border-slate-700 ${
        isLatest ? "ring-2 ring-slate-400 dark:ring-slate-500" : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-10 h-10 shrink-0 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarFallback className="bg-slate-600 text-white dark:bg-slate-500">
                {getInitials(review.curator.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {review.curator.name}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {review.curator.email}
              </CardDescription>
            </div>
          </div>
          {isLatest && (
            <Badge
              variant="default"
              className="text-xs shrink-0 bg-slate-600 dark:bg-slate-500"
            >
              Actual
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Inicio
              </p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 mt-0.5">
                {formatDate(review.startAt)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Vencimiento
              </p>
              <p
                className={`text-sm font-semibold mt-0.5 ${
                  isOverdue
                    ? "text-red-600 dark:text-red-400"
                    : "text-slate-900 dark:text-slate-50"
                }`}
              >
                {formatDate(review.dueAt || "")}
              </p>
            </div>
          </div>
        </div>

        {review.reviewedAt && (
          <div className="flex items-start gap-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                Completada
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                {formatDateTime(review.reviewedAt)}
              </p>
            </div>
          </div>
        )}

        {!review.reviewedAt && isOverdue && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <p className="text-xs font-semibold text-red-700 dark:text-red-300">
              Revisión vencida
            </p>
          </div>
        )}

        {review.notes && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Notas:
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {review.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
