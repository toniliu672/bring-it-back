"use client";

import React from "react";

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto p-4">
      {children}
    </div>
  );
}