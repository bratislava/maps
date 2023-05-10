import { motion } from "framer-motion";

export const Row = ({
  label,
  text,
  className,
}: {
  label: string;
  text: string;
  className?: string;
}) => {
  if (!text || (text === " " && !label)) {
    return null;
  } else {
    return (
      <motion.div className={className} layoutId={label}>
        <div className="font-semibold">{label}</div>
        {text.startsWith("http") ? (
          <a href={text} className="underline font-semibold" target="_blank" rel="noreferrer">
            {new URL(text).hostname.replace("www.", "")}
          </a>
        ) : text.includes("@") ? (
          <a href={`mailto:${text}`} className="underline font-semibold">
            {text}
          </a>
        ) : (
          <div className="">{text}</div>
        )}
      </motion.div>
    );
  }
};
