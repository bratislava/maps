import { Compass } from '@bratislava/react-maps-icons';
import { IconButton } from '@bratislava/react-maps-ui';
import { useCallback, useContext } from 'react';

import { mapContext } from '../Map/Map';
import i18n from '../../utils/i18n';
import { I18nextProvider, useTranslation } from 'react-i18next';

const CompassButtonWithoutTranslations = () => {
  const { mapState, methods: mapMethods } = useContext(mapContext);

  const { t } = useTranslation('maps', {
    keyPrefix: 'components.CompassButton',
  });

  // RESET BEARING HANDLER
  const handleCompassClick = useCallback(() => {
    mapMethods.changeViewport({ bearing: 0 });
  }, [mapMethods]);

  return (
    <IconButton aria-label={t('resetBearing')} onClick={handleCompassClick}>
      <div
        style={{
          transform: `rotate(${-(mapState?.viewport?.bearing ?? 0)}deg)`,
        }}
      >
        <Compass size="lg" />
      </div>
    </IconButton>
  );
};
export const CompassButton = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <CompassButtonWithoutTranslations />
    </I18nextProvider>
  );
};
