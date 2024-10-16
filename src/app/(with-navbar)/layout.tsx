"use client";

import { useSession } from "next-auth/react";
import { Navbar } from "@/components";
import React from "react";
import { NavItem } from "@/interfaces/componentsInterface";

export default function LayoutWithNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { href: "/", label: "Home" },
      { href: "/peta", label: "Map" }

    ];

    if (status === "authenticated" && session?.user) {
      const userItems: NavItem[] = [
        {
          label: "Manage Data",
          dropdown: [
            {
              href: "/manage/okupasi", label: "Manage Okupasi",
              value: ""
            },
            {
              href: "/manage/sekolah", label: "Manage Sekolah",
              value: ""
            },
          ],
        },
      ];

      if (session.user.role === "ADMIN") {
        userItems[0].dropdown?.push({
          href: "/manage/user",
          label: "Manage User",
          value: ""
        });
      }

      return [...baseItems, ...userItems];
    }

    return baseItems;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar logo="/logo.png" navItems={getNavItems()} />
      <main className="min-h-screen overflow-hidden">{children}</main>
    </div>
  );
}
