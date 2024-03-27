/// <reference types="react" />
interface IRoundedIconButtonProps {
    icon?: JSX.Element;
    children: React.ReactNode;
    onClick?: () => void;
    bgColor?: string;
    txtColor?: string;
}
declare const RoundedIconButon: ({ children, onClick, icon, bgColor, txtColor, }: IRoundedIconButtonProps) => JSX.Element;
export default RoundedIconButon;
