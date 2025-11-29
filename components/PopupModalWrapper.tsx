import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PopupModalWrapper = ({
  children,
  closeAndResetForm,
  isOpen,
}: {
  children: React.ReactNode;
  closeAndResetForm: () => void;
  isOpen: boolean;
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return createPortal(
    <div
      onMouseDown={closeAndResetForm}
      className={`fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-9999 transition-class ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`mx-auto my-auto bg-background p-4 modal-content transition-class ${
          isAnimating ? "scale-100" : "scale-95"
        }`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default PopupModalWrapper;
