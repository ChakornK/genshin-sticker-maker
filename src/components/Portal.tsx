import { createPortal, type JSX } from "preact/compat";

export const Portal = ({ children }) =>
  typeof document !== "undefined" && createPortal(children, document.body);
