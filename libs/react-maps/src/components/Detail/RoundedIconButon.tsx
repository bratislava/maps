interface IRoundedIconButtonProps {
  icon?: JSX.Element;
  children: React.ReactNode;
  onClick?: () => void;
  bgColor?: string;
  txtColor?: string;
}

const RoundedIconButon = ({
  children,
  onClick,
  icon,
  bgColor = 'black',
  txtColor = 'black',
}: IRoundedIconButtonProps) => {
  return (
    <button
      style={{ backgroundColor: bgColor, color: txtColor }}
      className={
        'mr-2 mb-2 flex h-9 items-center justify-center gap-2 rounded-full px-4 font-semibold text-[white]'
      }
      onClick={onClick}
    >
      {icon} {children}
    </button>
  );
};

export default RoundedIconButon;
