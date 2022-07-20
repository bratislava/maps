import { List } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import React, { MouseEvent } from "react";

export const LegendButton = ({
  onLegendClick,
}: {
  onLegendClick: (e: MouseEvent) => void;
}) => {
  return (
    <IconButton onClick={onLegendClick}>
      <List size="xl" />
    </IconButton>
  );
};
