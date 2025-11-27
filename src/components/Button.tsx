import type { JSX } from "preact/compat";

export const Button = ({
  children,
  type,
  onClick,
}: {
  children: JSX.Element;
  type: "cancel" | "confirm" | "change";
  onClick: () => void;
}) => {
  return (
    <button
      className={
        "bg-light text-darkest flex items-center rounded-full p-1 pr-3 cursor-pointer"
      }
      onClick={onClick}
    >
      {type === "cancel" && <CancelIcon />}
      {type === "confirm" && <ConfirmIcon />}
      {type === "change" && <ChangeIcon />}
      <span className={"ml-2"}>{children}</span>
    </button>
  );
};

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
  >
    <path
      fill="#313131"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
    ></path>
    <path
      fill="#38a2e7"
      d="M14.896 15.949a.744.744 0 1 0 1.052-1.053L13.053 12l2.895-2.896a.744.744 0 1 0-1.052-1.053L12 10.947 9.104 8.051a.745.745 0 1 0-1.053 1.053L10.947 12l-2.896 2.896a.745.745 0 0 0 1.053 1.053L12 13.053l2.896 2.896Z"
    ></path>
  </svg>
);

const ConfirmIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
  >
    <path
      fill="#313131"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
    ></path>
    <path
      fill="#ebc452"
      fill-rule="evenodd"
      d="M12 15.75a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5ZM12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
      clip-rule="evenodd"
    ></path>
  </svg>
);

const ChangeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={24}
    height={24}
  >
    <path
      fill="#313131"
      d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z"
    ></path>
    <path
      fill="#ebc452"
      d="m15.32 7.062 1.666 2.934c.043.074-.018.163-.11.16l-3.518-.173c-.09-.005-.14-.096-.093-.167l.35-.523c.06-.09.09-.134.077-.18-.013-.046-.061-.069-.157-.115-1.32-.638-2.984-.441-4.091.59l-.62.577a.307.307 0 0 1-.413 0l-.826-.77a.26.26 0 0 1 0-.384l.62-.577c1.697-1.58 4.266-1.855 6.265-.821.098.05.147.076.192.065.045-.011.073-.054.13-.14l.325-.483c.048-.07.16-.067.202.007Zm-6.64 9.876-1.666-2.933c-.043-.075.019-.165.11-.16l3.518.172c.09.005.14.097.093.167l-.35.523c-.06.09-.09.134-.077.18.013.046.061.069.157.115 1.32.638 2.984.441 4.091-.59l.62-.577a.307.307 0 0 1 .413 0l.826.77a.26.26 0 0 1 0 .384l-.62.577c-1.697 1.58-4.266 1.855-6.265.821-.098-.05-.147-.076-.192-.065-.045.011-.074.054-.13.14l-.325.483c-.048.07-.16.067-.202-.007Z"
    ></path>
  </svg>
);
