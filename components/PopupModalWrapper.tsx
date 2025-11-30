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
      className={`fixed inset-0 bg-foreground/10 backdrop-blur-xs bg-opacity-50 flex items-center pt-10 lg:pt-6 px-4  justify-center z-9999 transition-class min-h-dvh ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="mx-auto my-auto max-h-[90vh] p-4 lg:p-6 overflow-y-auto bg-background relative"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          className="cursor-pointer absolute flex items-center justify-center size-5 top-3 right-3 hover:text-danger transition-class text-sm"
          onMouseDown={closeAndResetForm}
        >
          <i className="fa-solid fa-x"></i>
        </button>
        <div
          className={`modal-content transition-class ${
            isAnimating ? "scale-100" : "scale-95"
          }`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PopupModalWrapper;
