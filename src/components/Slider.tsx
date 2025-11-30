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
    const onPointerMove = (e: PointerEvent) => {
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
    document.addEventListener("pointermove", onPointerMove);

    return () => {
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [dragging, onChange, vertical]);

  useEffect(() => {
    const onPointerUp = () => {
      setDragging(false);
    };
    document.addEventListener("pointerup", onPointerUp);

    return () => {
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, [setDragging]);

  useEffect(() => {
    const onDocumentBlur = () => {
      setDragging(false);
    };
    document.addEventListener("blur", onDocumentBlur);

    return () => {
      document.removeEventListener("blur", onDocumentBlur);
    };
  }, [setDragging]);

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
        style={{
          top: vertical ? `${((value - min) / (max - min)) * 100}%` : "50%",
          left: vertical ? "50%" : `${((value - min) / (max - min)) * 100}%`,
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={() => setDragging(true)}
      />
    </div>
  );
};
