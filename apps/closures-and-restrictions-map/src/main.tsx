import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import App from "./components/App";
import i18n from "./utils/i18n";
import { I18nProvider } from "react-aria";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("No #root element...");
} else {
  ReactDOM.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <I18nProvider locale={i18n.language}>
          <App />
        </I18nProvider>
      </I18nextProvider>
    </React.StrictMode>,
    rootElement,
  );
}
