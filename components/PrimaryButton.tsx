const PrimaryButton = ({
  children,
  onClickHandle,
}: {
  children: string;
  onClickHandle: () => void;
}) => {
  return (
    <button
      className="flex items-center cursor-pointer transition-class group text-base lg:p-4 hover:opacity-100 hover:bg-white hover:text-black font-electrolize tracking-wide lg:font-semibold button-neon-hover"
      onMouseDown={onClickHandle}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
