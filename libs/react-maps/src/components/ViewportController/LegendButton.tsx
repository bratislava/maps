import { List } from '@bratislava/react-maps-icons';
import { IconButton } from '@bratislava/react-maps-ui';
import { MouseEvent } from 'react';

export function LegendButton({
  onLegendClick,
}: {
  onLegendClick: (e: MouseEvent) => void;
}) {
  return (
    <IconButton onClick={onLegendClick}>
      <List size="xl" />
    </IconButton>
  );
}
