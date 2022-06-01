import cx from 'classnames';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface SearchBarPlaceholderProps {
  children: ReactNode;
  filteringOpenState: [boolean, Dispatch<SetStateAction<boolean>>];
  moveSearchBarOutsideOfSideBarOnLargeScreen?: boolean;
}

export const SearchBarPlaceholder = ({
  children,
  filteringOpenState: [isFilteringOpen],
  moveSearchBarOutsideOfSideBarOnLargeScreen = false,
}: SearchBarPlaceholderProps) => {
  return (
    <div
      className={cx(
        `
          fixed left-4 right-4 sm:left-8 sm:right-8 bottom-10 transform transition-transform duration-500
          sm:z-20 sm:w-80 sm:bottom-auto sm:top-24
        `,
        {
          'md:left-[424px] md:top-4':
            moveSearchBarOutsideOfSideBarOnLargeScreen,
        },
        {
          'sm:-translate-x-96': !isFilteringOpen,
        }
      )}
    >
      {children}
    </div>
  );
};
