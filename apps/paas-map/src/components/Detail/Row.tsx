export const Row = ({ label, text }: { label: string; text: string }) => {
  if (!text || (text === ' ' && !label)) {
    return null;
  } else {
    return (
      <div className="">
        <div>{label}</div>
        <div className="font-bold">{text}</div>
      </div>
    );
  }
};
