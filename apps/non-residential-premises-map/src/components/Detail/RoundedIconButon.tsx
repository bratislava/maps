interface IRoundedIconButtonProps {
    icon?: JSX.Element;
    children: React.ReactNode;
    onClick?: () => void;
    bgColor?: string;
    txtColor?: string;
}

const RoundedIconButon = ({ children, onClick, icon, bgColor = "black", txtColor = "black" }: IRoundedIconButtonProps) => {
    return (
        <button
            style={{ backgroundColor: bgColor, color: txtColor }}
            className={`flex gap-2 text-[white] rounded-full font-semibold h-9 items-center justify-center pl-4 pr-4 mr-2 mb-2`}
            onClick={onClick}
        >
            {icon} {children}
        </button>
    );
}

export default RoundedIconButon;
