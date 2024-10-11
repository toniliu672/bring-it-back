import React, { useRef } from "react";
import { AnimatePresence, motion, MotionProps, useCycle } from "framer-motion";
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
      <Button
        onClick={() => toggleOpen()}
        className={`absolute top-2 right-2 w-[50px] h-[50px] rounded-full ${
          theme === "dark"
            ? "bg-[#2E2E2E] text-white"
            : "bg-white text-[#2E2E2E]"
        } shadow-md pointer-events-auto z-10`}
      >
        <svg width="23" height="23" viewBox="0 0 23 23">
          <Path
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
            stroke="currentColor"
          />
          <Path
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
            stroke="currentColor"
          />
          <Path
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
            }}
            stroke="currentColor"
          />
        </svg>
      </Button>
    </motion.nav>
  );
};

const Path: React.FC<MotionProps & React.SVGProps<SVGPathElement>> = (
  props
) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    strokeLinecap="round"
    {...props}
  />
);

export default Sidebar;
