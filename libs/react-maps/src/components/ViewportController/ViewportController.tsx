import cx from 'classnames';
import { forwardRef, Fragment, ReactNode, useContext, useMemo } from 'react';
import { mapContext } from '../Map/Map';

import { CompassButton } from './CompassButton';
import { FullscreenButton } from './FullscreenButton';
import { GeolocationButton } from './GeolocationButton';
import { LegendButton } from './LegendButton';
import { ZoomButtons } from './ZoomButtons';

// export type CustomSlot = {
//   icon: ReactNode;
//   onPress?: () => void;
// };

export type SlotType =
  | 'legend'
  | 'geolocation'
  | 'compass'
  | 'zoom'
  | 'fullscreen'
  | SlotType[];

const defaultSlots: SlotType[] = ['compass', 'zoom'];
const defaultDesktopSlots: SlotType[] = [
  'geolocation',
  'compass',
  ['fullscreen', 'zoom'],
];

interface ViewportControllerProps {
  className?: string;
  slots?: SlotType[];
  desktopSlots?: SlotType[];

  legend?: ReactNode;
  isLegendOpen?: boolean;
  onLegendOpenChange?: (isVisible: boolean) => void;
}

export const ViewportController = forwardRef<
  HTMLDivElement,
  ViewportControllerProps
>(
  (
    {
      className,
      slots = defaultSlots,
      desktopSlots = defaultDesktopSlots,
      legend,
      isLegendOpen,
      onLegendOpenChange,
    },
    ref,
  ) => {
    const legendButton = useMemo(() => {
      if (isLegendOpen !== undefined && legend && onLegendOpenChange) {
        return (
          <LegendButton
            legend={legend}
            isLegendOpen={isLegendOpen}
            onLegendOpenChange={onLegendOpenChange}
          />
        );
      }
      return null;
    }, [legend, onLegendOpenChange, isLegendOpen]);

    const geolocationButton = useMemo(() => {
      return <GeolocationButton />;
    }, []);

    const compassButton = useMemo(() => {
      return <CompassButton />;
    }, []);

    const fullscreenButton = useMemo(() => {
      return <FullscreenButton />;
    }, []);

    const zoomButton = useMemo(() => {
      return <ZoomButtons />;
    }, []);

    const slotMap = useMemo(() => {
      return {
        legend: legendButton,
        geolocation: geolocationButton,
        compass: compassButton,
        fullscreen: fullscreenButton,
        zoom: zoomButton,
      };
    }, [
      compassButton,
      fullscreenButton,
      geolocationButton,
      legendButton,
      zoomButton,
    ]);

    const { isMobile } = useContext(mapContext);

    const resultSlots = useMemo(() => {
      return isMobile ? slots : desktopSlots;
    }, [desktopSlots, isMobile, slots]);

    return (
      <div
        ref={ref}
        className={cx(
          'transform  duration-500 ease-in-out transition-transform pointer-events-none',
          className,
        )}
      >
        <div className="flex items-end gap-2">
          {resultSlots.map((slot, i) =>
            Array.isArray(slot) ? (
              <div key={i} className="flex flex-col gap-2">
                {slot.map((subSlot, j) =>
                  Array.isArray(subSlot) ? null : (
                    <Fragment key={j}>{slotMap[subSlot]}</Fragment>
                  ),
                )}
              </div>
            ) : (
              <Fragment key={i}>{slotMap[slot]}</Fragment>
            ),
          )}
        </div>
      </div>
    );
  },
);

ViewportController.displayName = 'ViewportController';
