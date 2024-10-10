// components/feedback/Modal.tsx

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ModalProps, ModalButton } from "@/interfaces/componentsInterface";
import { XIcon } from "lucide-react";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  footer,
  buttons = [],
  isDirty = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    if (isDirty) {
      const shouldClose = window.confirm("You have unsaved changes. Are you sure you want to close?");
      if (shouldClose) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape") {
        handleClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'visible';
    };
  }, [isOpen, isDirty, onClose, closeOnEsc, closeOnOverlayClick]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: "max-w-sm",
    medium: "max-w-lg",
    large: "max-w-2xl",
  };

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} mx-auto flex flex-col max-h-[90vh] animate-modal-in`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <XIcon size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-4">
          <div className="text-gray-600 dark:text-gray-300">{children}</div>
        </div>
        {(footer || buttons.length > 0) && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-2">
            {footer || buttons.map((button: ModalButton, index: number) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`px-4 py-2 rounded-md ${button.className}`}
              >
                {button.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;