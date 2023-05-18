interface IRoundedIconButtonProps {
    icon: JSX.Element;
    children: React.ReactNode;
    onClick?: () => void;
}

const RoundedIconButon = ({ children, onClick, icon }: IRoundedIconButtonProps) => {
    return (
        <button
            className="flex gap-2 bg-[#E5EFF3] text-[#005F88] rounded-full font-semibold h-9 items-center justify-center pl-4 pr-4 mr-2 mb-2"
            onClick={onClick}
        >
            {icon} {children}
        </button>
    );
}

export default RoundedIconButon;
