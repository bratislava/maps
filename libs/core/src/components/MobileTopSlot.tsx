import { ReactNode } from 'react';

interface TopSlotProps {
  children: ReactNode;
}

export const MobileTopSlot = ({ children }: TopSlotProps) => {
  return (
    <div className="fixed flex items-center justify-center left-4 right-18 top-0 sm:hidden pointer-events-none select-none">
      {children}
    </div>
  );
};

export default MobileTopSlot;
