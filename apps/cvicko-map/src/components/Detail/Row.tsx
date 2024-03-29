export const Row = ({ label, text }: { label: string; text: string }) => {
  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <div>
        <div className="font-light text-[14px]">{label}</div>
        {text.startsWith("http") ? (
          <a href={text} className="underline font-semibold" target="_blank" rel="noreferrer">
            {new URL(text).hostname.replace("www.", "")}
          </a>
        ) : text.includes("@") ? (
          <a href={`mailto:${text}`} className="underline font-semibold">
            {text}
          </a>
        ) : (
          <div className="font-semibold">{text}</div>
        )}
      </div>
    );
  }
};
