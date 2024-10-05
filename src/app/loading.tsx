"use client"

import { ProgressBar } from "@/components";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="w-64">
        <ProgressBar progress={100} />
      </div>
    </div>
  );
}