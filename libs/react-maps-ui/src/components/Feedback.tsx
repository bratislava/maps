import { Note } from "./Note";

export interface IFeedbackProps {
  problemHint: string;
  reportProblemLink: string;
  reportProblem: string;
}

export const Feedback = ({
  problemHint,
  reportProblemLink,
  reportProblem,
}: IFeedbackProps) => {
  return (
    <Note className={`flex flex-col gap-3 !bg-[#FCF2E6]`}>
      <div className="flex-1 dark:text-text">{problemHint}</div>
      <a
        href={reportProblemLink}
        target="_blank"
        className="underline"
        rel="noreferrer"
      >
        {reportProblem}
      </a>
    </Note>
  );
};
