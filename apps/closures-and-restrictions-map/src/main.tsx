import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("No #root element...");
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
}
