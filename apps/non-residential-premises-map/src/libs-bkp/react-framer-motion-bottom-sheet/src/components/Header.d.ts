import { FC, ReactNode } from 'react';
import { SheetContext } from './Sheet';
export type HeaderProps = {
    children?: ReactNode | FC<SheetContext>;
};
export declare const Header: ({ children: ChildrenNodeOrComponent }: HeaderProps) => JSX.Element;
