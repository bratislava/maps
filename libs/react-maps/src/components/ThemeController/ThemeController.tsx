import { Darkmode, Satellite, Themes } from '@bratislava/react-maps-icons';
import { AnimateHeight, Popover } from '@bratislava/react-maps-ui';
import cx from 'classnames';
import { useCallback, useContext, useRef, useState } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import { useOnClickOutside } from 'usehooks-ts';

import { mapContext } from '../Map/Map';
import { MapActionKind } from '../Map/mapReducer';

import i18n from '../../utils/i18n';

interface ThemeControllerProps {
  className?: string;
}

const ThemeControllerWithoutTranslations = ({
  className,
}: ThemeControllerProps) => {
  const { mapState, dispatchMapState } = useContext(mapContext);

  const { t } = useTranslation('maps', {
    keyPrefix: 'components.ThemeController',
  });

  const [isOpen, setOpen] = useState(false);

  const handleDarkmodeChange = useCallback(
    (isDarkmode: boolean) => {
      dispatchMapState &&
        dispatchMapState({
          type: MapActionKind.SetDarkmode,
          value: isDarkmode,
        });
      document.body.classList[isDarkmode ? 'add' : 'remove']('dark');
    },
    [dispatchMapState],
  );

  const handleSatelliteChange = useCallback(
    (isSatellite: boolean) => {
      dispatchMapState &&
        dispatchMapState({
          type: MapActionKind.SetSatellite,
          value: isSatellite,
        });
    },
    [dispatchMapState],
  );

  const ref = useRef(null);

  const handleClickOutside = () => {
    setOpen(false);
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div
      className={cx(
        'transform duration-500 ease-in-out flex gap-2 transition-transform',
        className,
      )}
    >
      <div
        className={cx(
          'flex flex-col h-auto text-font items-center justify-center pointer-events-auto shadow-lg bg-background-lightmode dark:bg-background-darkmode rounded-lg border-2 border-background-lightmode dark:border-gray-darkmode dark:border-opacity-20 w-12',
          {
            // "transform active:scale-75 transition-all": !noAnimation,
          },
        )}
      >
        <AnimateHeight isVisible={isOpen} className="flex flex-col">
          <Popover
            isSmall
            button={({ isOpen, open, close }) => (
              <button
                aria-label={
                  isOpen
                    ? t('aria.disableSatelliteLayer')
                    : t('aria.enableSatelliteLayer')
                }
                onMouseEnter={open}
                onMouseLeave={close}
                onMouseDown={() => {
                  handleSatelliteChange(!mapState?.isSatellite);
                  close();
                }}
                className="flex h-12 w-12 items-center justify-center"
              >
                <Satellite size="xl" />
              </button>
            )}
            panel={<div>{t('satelliteMode')}</div>}
          />
          <div className="bg-gray-lightmode dark:bg-gray-darkmode mx-auto h-[2px] w-8 opacity-20" />
          <Popover
            isSmall
            button={({ open, close }) => (
              <button
                aria-label={
                  mapState?.isDarkmode
                    ? t('aria.setLightBase')
                    : t('aria.setDarkBase')
                }
                onMouseEnter={open}
                onMouseLeave={close}
                onMouseDown={() => {
                  handleDarkmodeChange(!mapState?.isDarkmode);
                  close();
                }}
                className="flex h-12 w-12 items-center justify-center"
              >
                <Darkmode size="xl" />
              </button>
            )}
            panel={<div>{t('darkLightMode')}</div>}
          />
        </AnimateHeight>
        <button
          aria-label={
            isOpen ? t('aria.closeBaseOptions') : t('aria.openBaseOptions')
          }
          ref={ref}
          onClick={() => setOpen(!isOpen)}
          className="flex h-11 w-12 items-center justify-center"
        >
          <Themes size="xl" />
        </button>
      </div>
    </div>
  );
};

export const ThemeController = (props: ThemeControllerProps) => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeControllerWithoutTranslations {...props} />
    </I18nextProvider>
  );
};
