import { Funnel } from "@bratislava/mapbox-maps-icons";

export interface IMobileHeaderProps {
  onFunnelClick: () => void;
}

export const MobileHeader = ({ onFunnelClick }: IMobileHeaderProps) => {
  return (
    <div>
      <div className="fixed top-4 right-4 z-10 sm:hidden">
        <button
          onClick={onFunnelClick}
          className="flex text-font w-12 h-12 items-center justify-center pointer-events-auto shadow-lg bg-background rounded-lg"
        >
          <Funnel className="w-12 h-12" />
        </button>
      </div>
    </div>
  );
};
