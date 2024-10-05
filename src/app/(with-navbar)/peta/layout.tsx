"use client";

import { useState, useEffect } from "react";
import { FadeIn, Sidebar, Loading } from "@/components";
import React from "react";

export default function PetaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Adjust this time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FadeIn>
        <div className="flex flex-col h-screen overflow-hidden">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loading size={60} className="p-4" />
            </div>
          ) : (
            <div className="flex-1 relative">
              <main className="absolute inset-0">{children}</main>
              <Sidebar className="z-40 top-8 bottom-20 ">
                {/* Sidebar content goes here */}
              </Sidebar>
            </div>
          )}
        </div>
      </FadeIn>
    </>
  );
}
