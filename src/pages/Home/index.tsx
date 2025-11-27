import { useState } from "preact/hooks";

import "./style.css";
import { Slider } from "../../components/Slider";

export function Home() {
  return (
    <main className={"flex h-full flex-col items-center gap-4 p-8"}>
      <h1 class={"text-center text-4xl sm:text-6xl"}>Genshin Sticker Maker</h1>
      <div class={"w-full max-w-2xl grow"}>
        <Editor />
      </div>
    </main>
  );
}

function Editor() {
  const [x, setX] = useState(50);
  const [y, setY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [fontSize, setFontSize] = useState(12);

  return (
    <div class={"flex flex-col items-center gap-8 sm:flex-row sm:items-start"}>
      <div class={"grid grid-cols-[2fr_2em] grid-rows-[2fr_2em]"}>
        <Preview />
        <Slider
          vertical
          value={x}
          min={0}
          max={100}
          onChange={(v) => setX(v)}
        />
        <Slider value={y} min={0} max={100} onChange={(v) => setY(v)} />
      </div>
      <div
        class={
          "max-w-2xs flex w-full grow flex-col items-stretch sm:max-w-full"
        }
      >
        <p>Rotation</p>
        <Slider
          value={rotation}
          min={-180}
          max={180}
          onChange={(v) => setRotation(v)}
        />

        <p class={"mt-4"}>Font size</p>
        <Slider
          value={fontSize}
          min={1}
          max={48}
          onChange={(v) => setFontSize(v)}
        />

        <p class={"mt-4"}>Text</p>
        <textarea class={"mt-2 rounded-lg bg-black/30 p-2"}></textarea>
      </div>
    </div>
  );
}

function Preview() {
  return <div class={"bg-darker h-64 w-64 rounded-xl"}></div>;
}
