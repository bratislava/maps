import { FC, ReactNode, useContext, useMemo } from 'react';
import { SheetContext, sheetContext } from './Sheet';

export type HeaderProps = {
  children?: ReactNode | FC<SheetContext>;
};

export const Header = ({ children: ChildrenNodeOrComponent }: HeaderProps) => {
  const ctx = useContext(sheetContext);

  const resultChildren = useMemo(() => {
    return typeof ChildrenNodeOrComponent === 'function' ? (
      <ChildrenNodeOrComponent {...ctx} />
    ) : (
      ChildrenNodeOrComponent
    );
  }, [ChildrenNodeOrComponent, ctx]);

  return <div>{resultChildren}</div>;
};
