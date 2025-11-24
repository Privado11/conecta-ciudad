import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-6 w-48 bg-gray-200" />
              <Skeleton className="h-5 w-20 bg-gray-200" />
            </div>
            <Skeleton className="h-4 w-full bg-gray-200" />
            <Skeleton className="h-4 w-3/4 mt-2 bg-gray-200" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-5 w-16 bg-gray-200" />
            <Skeleton className="h-4 w-24 bg-gray-200" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-24 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
            <Skeleton className="h-4 w-28 bg-gray-200" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-4 w-40 bg-gray-200" />
        <Skeleton className="h-9 w-24 bg-gray-200" />
      </CardFooter>
    </Card>
  );
}
