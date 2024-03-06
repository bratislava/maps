export type PopupProps = {
  name: string;
  workingGroups?: string[];
};

export const Popup = ({ name, workingGroups }: PopupProps) => (
  <div>
    <div className="flex">{name}</div>
    <div>
      {workingGroups?.map((workingGroup, index) => (
        <div key={index}>{workingGroup}</div>
      ))}
    </div>
  </div>
);
