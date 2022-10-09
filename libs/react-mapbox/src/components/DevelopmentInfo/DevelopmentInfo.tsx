import { Viewport } from '../../types';

export interface IDevelopmentInfoProps {
  isDevelopment?: boolean;
  viewport: Viewport;
}

export const DevelopmentInfo = ({
  isDevelopment,
  viewport,
}: IDevelopmentInfoProps) => {
  return isDevelopment ? (
    <div className="fixed w-100 top-4 right-4 p-4 rounded-lg bg-black text-white bg-opacity-50">
      <div>
        <pre>{JSON.stringify(viewport, null, 2)}</pre>
      </div>
    </div>
  ) : null;
};
