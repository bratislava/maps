import { Funnel } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";

export interface IMobileHeaderProps {
  onFunnelClick: () => void;
}

export const MobileHeader = ({ onFunnelClick }: IMobileHeaderProps) => {
  return (
    <div className="fixed top-4 right-4 z-10 sm:hidden">
      <IconButton onClick={onFunnelClick}>
        <Funnel size="lg" />
      </IconButton>
    </div>
  );
};
