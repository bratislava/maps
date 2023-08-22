import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import App from "./components/App";
import i18n from "./utils/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// FIXME: warning: ReactDOM.render is no longer supported in React 18, after fixing map goes too endless loop
// TODO: find the reason, after fix update ReactDOM.render
const rootElement = document.getElementById("root");
const queryClient = new QueryClient();

if (!rootElement) {
  console.error("No #root element...");
} else {
  ReactDOM.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </I18nextProvider>
    </React.StrictMode>,
    rootElement,
  );
}
