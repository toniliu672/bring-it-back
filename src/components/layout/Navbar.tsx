import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ThemeToggle, Dropdown, Modal } from "@/components";
import { NavbarProps, NavItem } from "@/interfaces/componentsInterface";
import { useRouter } from "next/navigation";
import React from "react";

const Navbar: React.FC<NavbarProps> = ({ logo, navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItemStyles = (isActive: boolean) =>
    twMerge(
      "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
      isActive
        ? "bg-blue-400 text-white"
        : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
    );

  const renderNavItem = (item: NavItem, isMobile: boolean = false) => {
    if (item.dropdown) {
      return (
        <Dropdown
          key={item.label}
          label={item.label}
          items={item.dropdown}
          isMobile={isMobile}
        />
      );
    }
    return (
      <Link
        key={item.href}
        href={item.href || "#"}
        className={twMerge(
          navItemStyles(pathname === item.href),
          isMobile ? "block" : ""
        )}
        onClick={isMobile ? toggleMenu : undefined}
      >
        {item.label}
      </Link>
    );
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    const data = await signOut({ redirect: false, callbackUrl: "/login" });
    router.push(data.url);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <nav className="bg-white shadow-md dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              {logo ? (
                <Image
                  src={logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              ) : (
                <span className="text-blue-600 dark:text-white text-xl font-bold">
                  Logo
                </span>
              )}
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => renderNavItem(item))}
              {session && (
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              )}
              <ThemeToggle className="ml-4 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-white" />
            </div>
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => renderNavItem(item, true))}
            {session && (
              <button
                onClick={handleLogoutClick}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            )}
            <div className="mt-4">
              <ThemeToggle className="w-full text-left px-3 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" />
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        title="Confirm Logout"
        buttons={[
          {
            text: "Cancel",
            onClick: handleLogoutCancel,
            className: "bg-gray-200 text-gray-800 hover:bg-gray-300"
          },
          {
            text: "Logout",
            onClick: handleLogoutConfirm,
            className: "bg-red-600 text-white hover:bg-red-700"
          }
        ]}
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </>
  );
};

export default Navbar;
