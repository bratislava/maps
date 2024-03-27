import { ReactNode } from 'react';
export interface ILayoutProps {
    isOnlyMobile?: boolean;
    isOnlyDesktop?: boolean;
    children?: ReactNode;
}
export declare function Layout({ isOnlyMobile, isOnlyDesktop, children, }: ILayoutProps): JSX.Element;
