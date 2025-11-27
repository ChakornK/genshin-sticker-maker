import { useEffect, useRef, useState } from "preact/hooks";
import "./Slider.css";
import { clamp } from "../utils/math";

export const Slider = ({
  vertical,
  value,
  onChange,
  min,
  max,
}: {
  vertical?: boolean;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}) => {
  const [dragging, setDragging] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMousemove = (e: MouseEvent) => {
      if (dragging) {
        const bounds = parentRef.current!.getBoundingClientRect();
        onChange(
          vertical
            ? clamp((e.clientY - bounds.top) / bounds.height, 0, 1) *
                (max - min) +
                min
            : clamp((e.clientX - bounds.left) / bounds.width, 0, 1) *
                (max - min) +
                min
        );
      }
    };
    document.addEventListener("mousemove", onMousemove);

    return () => {
      document.removeEventListener("mousemove", onMousemove);
    };
  }, [dragging]);

  useEffect(() => {
    const onMouseup = () => {
      setDragging(false);
    };
    document.addEventListener("mouseup", onMouseup);

    return () => {
      document.removeEventListener("mouseup", onMouseup);
    };
  }, []);

  return (
    <div
      class={`${
        vertical ? "mx-4 h-full w-2" : "my-4 h-2 w-full"
      }${" "}relative rounded-full bg-black/30`}
      ref={parentRef}
    >
      <button
        class={
          "slider-thumb absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2"
        }
        style={
          vertical
            ? {
                top: `${((value - min) / (max - min)) * 100}%`,
                left: "50%",
              }
            : {
                left: `${((value - min) / (max - min)) * 100}%`,
                top: "50%",
              }
        }
        onMouseDown={() => setDragging(true)}
      ></button>
    </div>
  );
};
