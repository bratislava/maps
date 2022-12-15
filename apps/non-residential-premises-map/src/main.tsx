import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./components/App";
import i18n from "./utils/i18n";

const rootElement = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

rootElement.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>,
);
