import { Funnel } from "@bratislava/react-maps-icons";

export interface IMobileHeaderProps {
  onFunnelClick: () => void;
}

export const MobileHeader = ({ onFunnelClick }: IMobileHeaderProps) => {
  return (
    <div>
      <div className="fixed top-4 right-4 z-10 sm:hidden">
        <button
          onClick={onFunnelClick}
          className="flex text-font w-12 h-12 items-center justify-center border-2 pointer-events-auto shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 transition-all"
        >
          <Funnel className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};
