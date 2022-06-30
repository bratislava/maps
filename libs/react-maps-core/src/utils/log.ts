export const log = (message?: string | number | boolean) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`%c${message}`, "color: #3b82ed; font-weight: bold");
  }
};
