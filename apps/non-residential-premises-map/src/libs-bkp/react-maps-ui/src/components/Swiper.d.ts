import { ReactNode, FC } from "react";
type SwiperProps = {
    pages: ReactNode[];
    autoSwipeDuration?: number;
    initialPage?: number;
    allowKeyboardNavigation?: boolean;
    description?: string;
    pagination?: FC<{
        count: number;
        activeIndex: number;
        goToPage: (index: number) => void;
        goToPrevious: () => void;
        goToNext: () => void;
    }>;
};
export declare const Swiper: import("react").ForwardRefExoticComponent<SwiperProps & import("react").RefAttributes<HTMLDivElement>>;
export {};
