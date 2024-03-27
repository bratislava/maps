import { List } from '@bratislava/react-maps-icons';
import { IconButton, Popover } from '@bratislava/react-maps-ui';
import { ReactNode, useCallback, useContext, useMemo } from 'react';
import { mapContext } from '../Map/Map';

export const LegendButton = ({
  legend,
  isLegendOpen,
  onLegendOpenChange,
}: {
  legend: ReactNode;
  isLegendOpen: boolean;
  onLegendOpenChange: (isVisible: boolean) => void;
}) => {
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      onLegendOpenChange(isOpen);
    },
    [onLegendOpenChange],
  );

  const { isMobile } = useContext(mapContext);

  const button = useMemo(
    () => (
      <IconButton onClick={() => handleOpenChange(!isLegendOpen)}>
        <List size="xl" />
      </IconButton>
    ),
    [handleOpenChange, isLegendOpen],
  );

  if (isMobile || !legend) {
    return button;
  }

  return (
    <Popover
      isOpen={isLegendOpen}
      onOpenChange={handleOpenChange}
      button={button}
      panel={legend}
      allowedPlacements={['top']}
    />
  );
};
