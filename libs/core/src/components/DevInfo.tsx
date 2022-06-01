import { IViewportProps } from '../types';

interface DevInfoProps {
  viewport: IViewportProps;
}

export const DevInfo = ({ viewport }: DevInfoProps) => {
  return process.env.NODE_ENV === 'development' ? (
    <div className="relative w-fit">
      <div className="absolute right-full mr-4 w-64 bg-white bg-opacity-50 p-4">
        <div className="w-full flex justify-between">
          <div className="font-bold">lat</div>
          <div>{viewport.lat.toFixed(4)}</div>
        </div>
        <div className="w-full flex justify-between">
          <div className="font-bold">lng</div>
          <div>{viewport.lng.toFixed(4)}</div>
        </div>
        <div className="w-full flex justify-between">
          <div className="font-bold">zoom</div>
          <div>{viewport.zoom.toFixed(4)}</div>
        </div>
        <div className="w-full flex justify-between">
          <div className="font-bold">padding-left</div>
          <div>{viewport.paddingLeft}</div>
        </div>
        <div className="w-full flex justify-between">
          <div className="font-bold">padding-right</div>
          <div>{viewport.paddingRight}</div>
        </div>
      </div>
    </div>
  ) : null;
};
