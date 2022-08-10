export type LogColor = "effect" | "callback";

export const log = (
  message?: string | number | boolean,
  logColor?: LogColor
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(
      `%c${message}`,
      `color: ${
        logColor === "callback"
          ? "#3b82ed"
          : logColor === "effect"
          ? "#edb418"
          : "black"
      }; font-weight: bold`
    );
  }
};
