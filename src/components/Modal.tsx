import { type JSX } from "preact/compat";
import { Portal } from "./Portal";

export const Modal = ({
  children,
  visible,
  onClose,
  title,
}: {
  children: JSX.Element;
  visible: boolean;
  onClose: () => void;
  title: string;
}) => {
  return (
    <Portal>
      <div
        class={
          "fixed bottom-0 left-0 right-0 top-0 flex items-center transition-opacity justify-center p-8 sm:p-16 bg-black/50"
        }
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "" : "none",
        }}
        onClick={onClose}
      >
        <div
          class={
            "bg-dark relative flex max-h-full max-w-full flex-col items-stretch gap-2 rounded-xl p-2"
          }
          onClick={(e) => e.stopPropagation()}
        >
          <p class={"text-center text-2xl"}>{title}</p>
          <button
            class={"absolute right-3 top-3 cursor-pointer"}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
          <div
            class={
              "min-h-24 min-w-48 h-full w-full overflow-y-auto overflow-x-hidden"
            }
          >
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width={20}
    height={20}
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M3.5 3.7c0-.11.09-.2.2-.2h3.903a.2.2 0 0 1 .142.342l-1 .999a.2.2 0 0 0 0 .283l5.114 5.113a.2.2 0 0 0 .283 0l5.113-5.113a.2.2 0 0 0 0-.283l-1-1a.2.2 0 0 1 .142-.34H20.3a.2.2 0 0 1 .2.2v3.902a.2.2 0 0 1-.341.142l-1-1a.2.2 0 0 0-.283 0l-5.113 5.114a.2.2 0 0 0 0 .282l5.113 5.114a.2.2 0 0 0 .283 0l1-1a.2.2 0 0 1 .341.142V20.3a.2.2 0 0 1-.2.2h-3.903a.2.2 0 0 1-.141-.341l1-1a.2.2 0 0 0 0-.283l-5.114-5.113a.2.2 0 0 0-.283 0l-5.114 5.113a.2.2 0 0 0 0 .283l1 1a.2.2 0 0 1-.142.34H3.7a.2.2 0 0 1-.2-.2v-3.902a.2.2 0 0 1 .342-.141l1 .999a.2.2 0 0 0 .282 0l5.114-5.114a.2.2 0 0 0 0-.282L5.124 6.745a.2.2 0 0 0-.283 0l-1 1a.2.2 0 0 1-.34-.142V3.7Z"
    />
  </svg>
);
