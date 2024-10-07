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
    const baseItems: NavItem[] = [{ href: "/", label: "Home" }];

    if (status === "authenticated" && session?.user) {
      const userItems: NavItem[] = [
        {
          label: "Manage Data",
          dropdown: [
            { href: "/manage/occupations", label: "Manage Okupasi" },
            { href: "/manage/schools", label: "Manage Sekolah" },
            { href: "/manage/competencyUnits", label: "Manage Unit Kompetensi" },
          ],
        },
      ];

      if (session.user.role === "ADMIN") {
        userItems[0].dropdown?.push({
          href: "/manage/user",
          label: "Manage User",
        });
      }

      return [...baseItems, ...userItems];
    }

    return baseItems;
  };

  return (
    <>
      <Navbar logo="/logo.png" navItems={getNavItems()} />
      <main className="min-h-screen overflow-hidden">{children}</main>
    </>
  );
}
