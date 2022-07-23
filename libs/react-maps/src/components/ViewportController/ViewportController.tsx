import cx from "classnames";
import React, { forwardRef, MouseEvent, useCallback } from "react";
import { ZoomButtons } from "./ZoomButtons";
import { FullscreenButton } from "./FullscreenButton";
import { CompassButton } from "./CompassButton";
import { GeolocationButton } from "./GeolocationButton";
import { LegendButton } from "./LegendButton";

export type SlotType =
  | "legend"
  | "geolocation"
  | "compass"
  | "zoom"
  | "fullscreen"
  | SlotType[];

interface ViewportControllerProps {
  className?: string;
  onLegendClick?: (e: MouseEvent) => void;
  slots?: SlotType[];
}

export const ViewportController = forwardRef<
  HTMLDivElement,
  ViewportControllerProps
>(
  (
    {
      className,
      onLegendClick = () => void 0,
      slots = ["geolocation", "compass", ["fullscreen", "zoom"]],
    },
    ref
  ) => {
    const RenderSlot = useCallback(
      ({ slot }: { slot: SlotType }) => {
        switch (slot) {
          case "legend":
            return <LegendButton onLegendClick={onLegendClick} />;

          case "geolocation":
            return <GeolocationButton />;

          case "compass":
            return <CompassButton />;

          case "fullscreen":
            return <FullscreenButton />;

          case "zoom":
            return <ZoomButtons />;

          default:
            return null;
        }
      },
      [onLegendClick]
    );

    return (
      <div
        ref={ref}
        className={cx(
          "transform  duration-500 ease-in-out transition-transform pointer-events-none",
          className
        )}
      >
        <div className="flex gap-2 items-end">
          {slots.map((slot, i) =>
            Array.isArray(slot) ? (
              <div key={i} className="flex flex-col gap-2">
                {slot.map((subSlot, j) => (
                  <RenderSlot key={j} slot={subSlot} />
                ))}
              </div>
            ) : (
              <RenderSlot key={i} slot={slot} />
            )
          )}
        </div>
      </div>
    );
  }
);

ViewportController.displayName = "ViewportController";
