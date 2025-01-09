import { Compass } from '@bratislava/react-maps-icons';
import { IconButton } from '@bratislava/react-maps-ui';
import { useContext } from 'react';

import { I18nextProvider, useTranslation } from 'react-i18next';
import i18n from '../../utils/i18n';
import { mapContext } from '../Map/Map';

const CompassButtonWithoutTranslations = () => {
  const { mapState, methods: mapMethods } = useContext(mapContext);

  const { t } = useTranslation('maps', {
    keyPrefix: 'components.CompassButton',
  });

  // RESET BEARING HANDLER
  const handleCompassClick = () => {
    mapMethods.changeViewport({ bearing: 0, zoom: mapState?.viewport.zoom });
  };

  return (
    <IconButton aria-label={t('resetBearing')}>
      <div
        onClick={() => handleCompassClick()}
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
