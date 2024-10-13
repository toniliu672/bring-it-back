import React, { useRef } from "react";
import { AnimatePresence, motion, useCycle } from "framer-motion";
import { Button } from "@/components";
import { SidebarProps } from "@/interfaces/componentsInterface";
import { useDimensions } from "@/hooks/useDimentsion";
import { useTheme } from "next-themes";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 29px) 29px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(20px at calc(100% - 30px) 30px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Sidebar: React.FC<SidebarProps> = ({ children, className }) => {
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const { theme } = useTheme();

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className={`fixed top-[80px] right-4 bottom-4 w-[300px] md:w-[350px] ${className} ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <motion.div
        className={`absolute inset-0 ${
          theme === "dark" ? "bg-[#1a1a1a]" : "bg-[#FFFFFF]"
        } rounded-3xl shadow-lg`}
        variants={sidebar}
      />
      <motion.div
        className={`relative h-full ${
          isOpen ? "overflow-y-auto" : "overflow-hidden"
        }`}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={variants}
              initial="closed"
              animate="open"
              exit="closed"
              className="p-6 space-y-4"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tombol dengan animasi panah */}
      <Button
        onClick={() => toggleOpen()}
        className={`absolute top-2 right-2 w-[50px] h-[50px] rounded-full flex items-center justify-center ${
          theme === "dark"
            ? "bg-[#2E2E2E] text-white"
            : "bg-white text-[#2E2E2E]"
        } shadow-md pointer-events-auto z-10`}
      >
        <motion.div
          initial={false}
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }} // Rotasi 90 derajat saat terbuka
          transition={{ duration: 0.4 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7" // Ikon panah kanan
            />
          </svg>
        </motion.div>
      </Button>
    </motion.nav>
  );
};

export default Sidebar;
