const SecondaryButton = ({
  danger = false,
  children,
  onClickHandle,
}: {
  danger?: boolean;
  children: string;
  onClickHandle: () => void;
}) => {
  return (
    <button
      className={`flex items-center cursor-pointer transition-class group text-base hover:opacity-100 px-2 py-0.5   font-electrolize tracking-wide hover:text-black border ${
        danger
          ? "text-danger hover:bg-danger border-danger/50 button-danger-hover "
          : "hover:bg-white border-slate-400/50 button-white-hover"
      }`}
      onMouseDown={onClickHandle}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
