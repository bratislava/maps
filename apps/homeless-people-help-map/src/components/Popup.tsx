export type PopupProps = {
  name: string;
  terrainServices?: string[];
};

export const Popup = ({ name, terrainServices }: PopupProps) => (
  <div>
    <div className="flex border-b-2 justify-center">{name}</div>
    <div className="py-4">
      {terrainServices?.map((terrainService, index) => (
        <div key={index}>{terrainService}</div>
      ))}
    </div>
  </div>
);
