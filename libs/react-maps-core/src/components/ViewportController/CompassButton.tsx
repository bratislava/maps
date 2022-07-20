import { Compass } from "@bratislava/react-maps-icons";
import { IconButton } from "@bratislava/react-maps-ui";
import React, { useCallback, useContext } from "react";
import { mapContext } from "../Map/Map";

export const CompassButton = () => {
  const { mapState, changeViewport } = useContext(mapContext);

  // RESET BEARING HANDLER
  const handleCompassClick = useCallback(() => {
    changeViewport({ bearing: 0 });
  }, [changeViewport]);

  return (
    <IconButton onClick={handleCompassClick}>
      <div
        style={{
          transform: `rotate(${-(mapState?.viewport?.bearing ?? 0)}deg)`,
        }}
      >
        <Compass size="lg" />
      </div>
    </IconButton>
  );
};
