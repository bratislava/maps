import { Chevron } from "@bratislava/react-maps-icons";
import { useEffect, useRef } from "react";

import IconButton from "../../atoms/IconButton/IconButton";
import { Modal, IModalProps } from "../../atoms/Modal/Modal";
import { Swiper } from "../Swiper/Swiper";

export type ImageLightBoxProps = {
  images: string[];
  initialImageIndex: number;
} & Omit<IModalProps, "children">;

export const ImageLightBox = (props: ImageLightBoxProps) => {
  const { images, initialImageIndex, ...rest } = props;

  const { isOpen } = rest;

  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      sliderRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      noOverlayStyles
      underlayClassName="!p-0"
      overlayClassName="w-full h-full pointer-events-none"
      {...rest}
    >
      <Swiper
        ref={sliderRef}
        allowKeyboardNavigation={images.length > 1}
        initialPage={initialImageIndex}
        pages={images.map((image) => (
          <div
            key={image}
            className="container mx-auto pointer-events-none flex h-full w-full max-w-6xl flex-col items-center justify-center px-6 md:px-[88px]"
          >
            <img
              draggable="false"
              className="pointer-events-auto h-auto max-h-[86vh] w-full select-none object-contain rounded-xl"
              src={image}
              alt={image}
            />
            {/* {attributes?.caption !== attributes?.name && (
              <div className="mt-4 rounded-2xl bg-white px-2.5 py-0.5">
                {attributes?.caption}
              </div>
            )} */}
          </div>
        ))}
        pagination={({ goToPrevious, goToNext, count, activeIndex }) => (
          <>
            <div className="container pointer-events-none absolute bottom-0 z-20 flex w-full max-w-6xl justify-between p-6 md:bottom-auto">
              {images.length > 1 && (
                <>
                  <IconButton
                    className="pointer-events-auto"
                    onClick={goToPrevious}
                  >
                    <Chevron direction="left" />
                  </IconButton>
                  <IconButton
                    className="pointer-events-auto"
                    onClick={goToNext}
                  >
                    <Chevron direction="right" />
                  </IconButton>
                </>
              )}
            </div>
            <div className="absolute font-semibold bottom-9 bg-background-lightmode dark:bg-background-darkmode shadow rounded-full px-3 flex items-center">
              {activeIndex + 1} / {count}
            </div>
          </>
        )}
      />
    </Modal>
  );
};
